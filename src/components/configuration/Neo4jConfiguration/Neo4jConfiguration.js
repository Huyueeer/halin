import React, { Component } from 'react';
import _ from 'lodash';

import queryLibrary from '../../../api/data/queries/query-library';
import PropTypes from 'prop-types';
import hoc from '../../higherOrderComponents';
import CypherDataTable from '../../data/CypherDataTable/CypherDataTable';
import Explainer from '../../ui/scaffold/Explainer/Explainer';

class Neo4jConfiguration extends Component {
    // URL path to where a config item can be looked up.
    baseURL = 'https://neo4j.com/docs/operations-manual/current/reference/configuration-settings/#config_';

    state = {
        rate: (1000 * 60 * 60),
        query: queryLibrary.DBMS_LIST_CONFIG.query,
        displayColumns: queryLibrary.DBMS_LIST_CONFIG.columns,
    };

    // Cell functions help render results.
    setCellFunction(accessor, fn) {
        const col = this.state.displayColumns.filter(c => c.accessor === accessor)[0];

        if (!col) { throw new Error('No such column'); }
        _.set(col, 'Cell', fn);
    }

    // Cell functions need to be set separately and not put into the query library
    // because they have react dependencies and need to refer to this component.
    componentDidMount() {
        this.setCellFunction('name', props =>
            <div className='Neo4jConfig_Name'>
                <a
                    target='neo4jConfig'
                    href={this.baseURL + props.value}>
                    {props.value}
                </a>
            </div>);

        this.setCellFunction('value', props =>
            <div className='Neo4jConfig_Value'>{props.value}</div>);

        this.setCellFunction('description',
            props => <div className="Neo4jConfig_Description">{props.value}</div>);
    }

    render() {
        return (
            <div className="Neo4jConfiguration">
                <h3>Neo4j Configuration <Explainer knowledgebase='Neo4jConfiguration' /></h3>

                <CypherDataTable
                    node={this.props.member}
                    query={this.state.query}
                    allowDownloadCSV={true}
                    displayColumns={this.state.displayColumns}
                    rate={this.state.rate}
                />
            </div>
        );
    }
}

Neo4jConfiguration.props = {
    member: PropTypes.object.isRequired,
};

export default hoc.adminOnlyComponent(Neo4jConfiguration, 'Neo4j Configuration', false);