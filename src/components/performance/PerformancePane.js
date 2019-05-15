import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Grid } from 'semantic-ui-react';
import uuid from 'uuid';

import MemoryMonitor from './MemoryMonitor';
import SystemLoad from './SystemLoad';
import GCMonitor from './GCMonitor';
import TransactionMonitor from './TransactionMonitor';
import Tasks from './task/Tasks';
import StoreFiles from '../diagnostic/StoreFiles';

export default class PerformancePane extends Component {
    render() {
        const key = uuid.v4();

        return (
            <div className="PerformancePane">
                <Grid divided='vertically'>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <SystemLoad key={key} node={this.props.node} />
                        </Grid.Column>

                        <Grid.Column>
                            <MemoryMonitor key={key} node={this.props.node} />
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <TransactionMonitor key={key} node={this.props.node} />
                        </Grid.Column>
                        <Grid.Column>
                            <GCMonitor key={key} node={this.props.node} />
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row columns={1}>
                        <Grid.Column>
                            <Tasks key={key} node={this.props.node}/>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row columns={1}>
                        <Grid.Column>
                            <StoreFiles key={key} node={this.props.node} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>  
            </div>
        );
    }
}
