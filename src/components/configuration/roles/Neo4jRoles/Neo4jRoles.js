import React, { Component } from 'react';
import CypherDataTable from '../../../data/CypherDataTable/CypherDataTable';
import { Grid, Button, Confirm, Modal, Icon } from 'semantic-ui-react';
import moment from 'moment';

import status from '../../../../api/status/index';
import sentry from '../../../../api/sentry/index';
import halin from '../../../../api';

import CSVDownload from '../../../data/download/CSVDownload';
import './Neo4jRoles.css';
import hoc from '../../../higherOrderComponents';
import Explainer from '../../../ui/scaffold/Explainer/Explainer';
import NewRoleForm from '../NewRoleForm/NewRoleForm';
import CopyRoleForm from '../CopyRoleForm/CopyRoleForm';

const copyRoleButton = (input) => 
    <Modal closeIcon
        trigger={
            <Button compact icon='copy' type='submit' />
        }>
        <Modal.Header>Copy Role: {input.role}</Modal.Header>

        <Modal.Content>
            <CopyRoleForm role={input.role} />
        </Modal.Content>
    </Modal>            

class Neo4jRoles extends Component {
    query = 'call dbms.security.listRoles()';
    static undeleteableRoles = [
        'admin', 'reader', 'architect', 'publisher', 'editor', 
        // Introduced in 4.1
        'PUBLIC', 
    ];

    static canDelete(role) {
        return Neo4jRoles.undeleteableRoles.indexOf(role) === -1;
    }

    displayColumns = [
        {
            Header: 'Actions',
            id: 'delete',
            minWidth: 70,
            maxWidth: 100,
            Cell: ({ row }) => (
                <div>
                    <Button compact negative
                        // Don't let people delete neo4j or admins for now.
                        disabled={!Neo4jRoles.canDelete(row.role)}
                        onClick={e => this.open(row)}
                        type='submit' icon="cancel"/>
                    {/* Only Neo4j 4.0 can do the COPY ROLE operation */}
                    { window.halinContext.getVersion().major >= 4 ? copyRoleButton(row) : ''}
                </div>
            ),
        },
        { Header: 'Role', accessor: 'role' },
        {
            Header: 'Users',
            accessor: 'users',
            Cell: ({ row }) => row.users.map((user, idx) => (
                <div className='user' key={idx}>
                    {user}{idx < row.users.length - 1 ? ',' : ''}
                </div>
            )),
        },
    ];

    state = {
        childRefresh: 1,
        refresh: 1,
    }

    UNSAFE_componentWillReceiveProps(props) {
        // If I receive a refresh signal, copy to child
        // which does data polling.  Man I wish there were a better way.
        const refresh = this.state.refresh;
        if (refresh !== props.refresh) {
            this.refresh(props.refresh);
        }
    }

    refresh(val = (this.state.refresh + 1)) {
        this.setState({
            refresh: val,
            childRefresh: val,
            message: null,
            error: null,
        });
    }

    addRoleButton() {
        return (
            <Modal closeIcon
                trigger={
                    <Button primary>
                        <Icon name='add' color='green'/> Add Role
                    </Button>
                }>
                <Modal.Header>Create New Role</Modal.Header>

                <Modal.Content>
                    <NewRoleForm 
                        node={this.props.node}
                        onUserCreate={() => this.refresh()} />
                </Modal.Content>
            </Modal>
        );
    }

    deleteRole(row) {
        sentry.info('DELETE ROLE', row);

        const mgr = window.halinContext.getClusterManager();

        return mgr.deleteRole(row.role)
            .then(clusterOpRes => {
                sentry.fine('ClusterMgr result', clusterOpRes);
                const action = `Deleting role ${row.role}`;

                if (clusterOpRes.success) {
                    this.setState({
                        pending: false,
                        error: null,
                    });
                } else {
                    this.setState({
                        pending: false,
                        error: status.fromClusterOp(action, clusterOpRes),
                    });
                }
            })
            .catch(err => this.setState({
                pending: false,
                error: status.message('Error',
                    `Could not delete role ${row.role}: ${err}`),
            }))
            .finally(() => this.state.error ? status.toastify(this) : null);
    }

    open = (row) => {
        this.setState({
            confirmOpen: true,
            activeRole: row,
        });
    };

    copy = (row) => {
        console.log('COPY ROLE',row);
    }

    confirm = () => {
        const roleToDelete = this.state.activeRole;
        this.setState({
            confirmOpen: false,
            activeRole: null,
            message: null,
            error: null,
        });

        return this.deleteRole(roleToDelete);
    }

    close = () => {
        this.setState({ confirmOpen: false });
    }

    onRecordsUpdate = (records /*, component */) => {
        this.setState({ data: records });
    };

    downloadCSVButton() {
        if (!this.state.data || this.state.data.length === 0) {
            return '';
        }

        return (
            <CSVDownload 
                title='Download'
                filename={`Halin-neo4j-roles-${moment.utc().format()}.csv`}
                data={this.state.data}
                displayColumns={this.displayColumns}
            />
        );
    }

    render() {
        return (
            <div className="Neo4jRoles">
                <h3>Roles <Explainer knowledgebase='Roles'/></h3>

                <Grid>
                    <Grid.Row columns={1}>                    
                        <Grid.Column>
                            <Button.Group size='small'>
                                { this.addRoleButton() } 
                                { this.downloadCSVButton() }
                                <Button onClick={e => this.refresh()} icon="refresh"/>
                            </Button.Group>                            
                        </Grid.Column>
                    </Grid.Row>

                    <Confirm
                        header='Delete Role'
                        content='Are you sure? This action cannot be undone.  If you delete this role, all users currently assigned to this role will lose it.'
                        open={this.state.confirmOpen}
                        onCancel={this.close}
                        onConfirm={this.confirm} />

                    <Grid.Row columns={1}>
                        <Grid.Column>
                            <CypherDataTable
                                node={this.props.node}
                                query={this.query}
                                showPagination={true}
                                refresh={this.state.childRefresh}
                                displayColumns={this.displayColumns}
                                database={halin.driver.SYSTEM_DB}
                                defaultPageSize={10}
                                onUpdate={this.onRecordsUpdate}
                                hideMemberLabel={true}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default hoc.enterpriseOnlyComponent(Neo4jRoles);