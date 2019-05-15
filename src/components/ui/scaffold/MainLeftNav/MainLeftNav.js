import React, { Component } from 'react';
import './MainLeftNav.css';
import { Sidebar, Segment, Menu, Icon, Image, Popup } from 'semantic-ui-react';
import ClusterOverviewPane from '../../../overview/ClusterOverviewPane';
import PermissionsPane from '../../../configuration/PermissionsPane';
import SettingsPane from '../../../settings/SettingsPane/SettingsPane';
import DiagnosticsPane from '../../../diagnostic/DiagnosticPane';
import MemberSelector from '../MemberSelector/MemberSelector';
import AppFooter from '../AppFooter/AppFooter';

const segmentStyle = {
    height: '100%',
    minHeight: 500,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
};

export default class MainLeftNav extends Component {
    state = {
        animation: 'push',
        visible: true,
        direction: 'left',
        section: 'home',
        lastSection: 'home',
        toggleCounter: 0,
        clusterMember: window.halinContext.members()[0],
    };

    section = section => {
        console.log('SECTION', section);

        if (section === this.state.section) {
            // Tracking a counter of how many times this menu item has been
            // clicked allows us to propagate toggle state to child.
            return this.setState({
                toggleCounter: this.state.toggleCounter + 1,
            });
        }

        // Set new state.
        this.setState({ 
            section, 
            lastSection: this.state.section,
            toggleCounter: 0,
        });
    };

    segmentWrap(content) {
        return (
            <Segment basic style={segmentStyle}>{content}</Segment>
        );
    }

    renderChildContent() {
        if (this.state.section === 'home') {
            return this.segmentWrap(<ClusterOverviewPane />);
        } else if (this.state.section === 'members') {
            return this.segmentWrap(<MemberSelector clickCount={this.state.toggleCounter} />);
        } else if (this.state.section === 'users') {
            return this.segmentWrap(<PermissionsPane node={this.state.clusterMember}/>);
        } else if (this.state.section === 'settings') {
            return this.segmentWrap(<SettingsPane/>);
        } else if (this.state.section === 'diagnostics') {
            return this.segmentWrap(<DiagnosticsPane/>);
        }

        return 'No child tab';
    }

    hoverPopup(text, trigger, key) {
        return (
            <Popup inverted key={key}
                on='hover' 
                position='right center'
                trigger={trigger} 
                content={text}/>
        );
    }

    render() {
        const selections = [
            {
                section: 'home',
                text: 'Overview',
                icon: <Image className='icon' style={{ filter:'invert(100%)' }} src='favicon-32x32.png'/>,
            },
            {
                section: 'members',
                text: 'Cluster Members',
                icon: <Icon name='computer' />,
            },
            {
                section: 'users',
                text: 'User Management',
                icon: <Icon name='group' />,
            },
            {
                section: 'diagnostics',
                text: 'Cluster Diagnostic Tools',
                icon: <Icon name='wrench'/>,
            },
            {
                section: 'settings',
                text: 'Settings',
                icon: <Icon name='cogs' />,
            },
        ];

        return (
            <Sidebar.Pushable as={Segment}
                style={{
                    marginTop: 0,
                    marginBottom: 0,
                }}>
                <Sidebar id='MainLeftNav'
                    as={Menu}
                    animation={this.state.animation}
                    direction={this.state.direction}
                    icon='labeled'
                    inverted
                    vertical
                    visible={this.state.visible}
                    width='thin'
                >
                    {
                        selections.map((selection, index) => 
                            this.hoverPopup(selection.text, 
                                <Menu.Item active={this.state.section === selection.section}
                                    index={index} as='a' 
                                    onClick={() => this.section(selection.section)}>
                                    { selection.icon }
                                </Menu.Item>, index))
                    }                    
                    <AppFooter />
                </Sidebar>
                <Sidebar.Pusher id='MainContent' dimmed={false}>
                    { this.renderChildContent() }
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        );
    }
}