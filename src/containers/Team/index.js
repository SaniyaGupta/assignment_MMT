import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { fetchTeamData, setFavouriteTeam } from './teamAction';
import { Radio, Icon } from 'antd';
import { Column, Table, InfiniteLoader } from 'react-virtualized';
import 'react-virtualized/styles.css';

export class Team extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            teamsToShow: 'all',
            loadedTeamList: [],
            sortBy: 'name',
            sortDirection: 'ASC'

        }
    }

    componentDidMount() {
        this.props.fetchTeamData();

    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.teamList && this.state.loadedTeamList.length === 0) {
            let clonedLoadedTeamList = [];
            if (this.state.teamsToShow === 'all') {
                for (let i = 0; i < 20; i++) {
                    clonedLoadedTeamList.push(this.props.teamList[i]);
                }
                this.setState({
                    loadedTeamList: this.state.sortBy === 'name' ? clonedLoadedTeamList.sort((a, b) => {
                        a = a.name.trim();
                        b = b.name.trim();
    
                        return a > b ? 1 : -1
                    })
                        : clonedLoadedTeamList.sort((a, b) => (a.wins < b.wins) ? 1 : -1)
                })
            }
            else if (prevState.teamsToShow!==this.state.teamsToShow && this.state.teamsToShow === 'favourite') {
                clonedLoadedTeamList = this.props.teamList.reduce((accumulator, currentValue) => {
                    if (this.props.favTeamIdForStatusMap && this.props.favTeamIdForStatusMap[currentValue.team_id] && accumulator.length < 20) {
                        accumulator.push(currentValue)
                    }
                    return accumulator;
                }, []);
                this.setState({
                    loadedTeamList: this.state.sortBy === 'name' ? clonedLoadedTeamList.sort((a, b) => {
                        a = a.name.trim();
                        b = b.name.trim();
    
                        return a > b ? 1 : -1
                    })
                        : clonedLoadedTeamList.sort((a, b) => (a.wins < b.wins) ? 1 : -1)
                })
            }
        
           
        }


    }
    toggleTeamToShow = (event) => {
        this.setState({
            teamsToShow: event.target.value,
            loadedTeamList: []
        })
    }
    handleSortBy = (event) => {
        const clonedLoadedTeamList = JSON.parse(JSON.stringify(this.state.loadedTeamList));
        this.setState({
            sortBy: event.target.value,
            loadedTeamList: event.target.value === 'name' ?
                clonedLoadedTeamList.sort((a, b) => {
                    a = a.name.trim();
                    b = b.name.trim();

                    return a > b ? 1 : -1
                })
                : clonedLoadedTeamList.sort((a, b) => (a.wins < b.wins) ? 1 : -1)
        })
    }

    renderFavourite = (coloumnData) => {
        return <Icon theme={this.props.favTeamIdForStatusMap[coloumnData.rowData.team_id] ? "filled" : ''}
            onClick={() => this.props.setFavouriteTeam(coloumnData.rowData.team_id, this.props.favTeamIdForStatusMap)}
            type="star" />
    }

    isRowLoaded = ({ index }) => {
        return !!this.state.loadedTeamList[index];
    }

    loadMoreRows = ({ startIndex, stopIndex }) => {
        const clonedLoadedTeamList = JSON.parse(JSON.stringify(this.state.loadedTeamList));
        if (this.state.teamsToShow === 'all') {
            for (let i = startIndex; i <= stopIndex; i++) {
                clonedLoadedTeamList.push(this.props.teamList[i]);
            }
        }
        else if (this.state.teamsToShow === 'favourite') {
            for (let i = startIndex; i <= stopIndex; i++) {
                const isAlreadyExistInList = clonedLoadedTeamList.find((team => team.team_id === this.props.teamList[i].team_id));
                if (this.props.favTeamIdForStatusMap[this.props.teamList[i].team_id] && !isAlreadyExistInList) {
                    clonedLoadedTeamList.push(this.props.teamList[i]);
                }
            }
        }
        this.setState({
            loadedTeamList: this.state.sortBy === 'name' ? clonedLoadedTeamList.sort((a, b) => {
                a = a.name.trim();
                b = b.name.trim();

                return a > b ? 1 : -1
            }) : clonedLoadedTeamList.sort((a, b) => (a.wins < b.wins) ? 1 : -1)
        })
    }

    render() {

        return (
            <div style={{ margin: 50 }}>
                <Radio.Group value={this.state.teamsToShow} onChange={this.toggleTeamToShow}>
                    <Radio.Button value="all">All Teams </Radio.Button>
                    <Radio.Button value="favourite">My Favourites</Radio.Button>
                </Radio.Group>
                <Radio.Group value={this.state.sortBy} onChange={this.handleSortBy} style={{ marginTop: 20 }}>
                    <Radio.Button value="name">Sort By Name(Ascending) </Radio.Button>
                    <Radio.Button value="wins">Sort By Win(Descending)</Radio.Button>
                </Radio.Group>

                <InfiniteLoader
                    isRowLoaded={this.isRowLoaded}
                    loadMoreRows={this.loadMoreRows}
                    rowCount={this.props.teamList.length}
                >
                    {({ onRowsRendered, registerChild }) => (
                        <Table
                            style={{ margin: 20, padding: 0 }}
                            width={window.innerWidth - 250}
                            height={500}
                            headerHeight={50}
                            rowHeight={60}
                            rowCount={this.state.loadedTeamList.length}
                            rowGetter={({ index }) => this.state.loadedTeamList[index]}
                            rowStyle={{ border: '1px solid black' }}
                            onRowsRendered={onRowsRendered}
                            ref={registerChild}
                        >
                            <Column
                                label='Logo'
                                dataKey='logo_url'
                                width={200}
                                cellRenderer={({ cellData }) => <img src={cellData} alt={cellData} width="50" height="50" />}
                            />
                            <Column
                                width={200}
                                label='Name'
                                dataKey='name'
                            />
                            <Column
                                width={200}
                                label='Wins'
                                dataKey='wins'
                            />
                            <Column
                                width={200}
                                label='Looses'
                                dataKey='losses'
                            />
                            {this.state.teamsToShow === 'all' && <Column
                                width={200}
                                label='Favourite'
                                dataKey='favourite'
                                cellRenderer={this.renderFavourite}
                            />}
                        </Table>
                    )}
                </InfiniteLoader>

            </div>

        )
    }
}

const mapStateToProps = state => ({
    teamList: state.team.teamList,
    favTeamIdForStatusMap: state.team.favTeamIdForStatusMap,
});

export default connect(mapStateToProps, {
    fetchTeamData,
    setFavouriteTeam
})(Team);