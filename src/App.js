import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// Set strings for API call
const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

function isSearched(searchTerm) {
    // Returned function has access to both item and searchTerm
    return item => item.title
    .toLowerCase().includes(searchTerm.toLowerCase());
}

class App extends Component {
    constructor(props) {
        // "this" not allowed in constructor prior to super call
        super(props);
        
        // Set state
        this.state = {
            result: null,
            searchTerm: DEFAULT_QUERY
        };
        // Bindings
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
    }

    onDismiss(id) {
        const isNotId = item => item.objectID !== id;
        const updatedHits = this.state.result.hits.filter(isNotId);
        // Creates new object with state result, uses the object spread to copy and update this.result
        const updatedResult = {...this.state.result, hits: updatedHits};
        // Replace list (avoids mutating old list and adhering to React conventions)
        this.setState({result: updatedResult});
    }


    // Used as part of the synthetic React event, so get an event
    onSearchChange(event) {
        this.setState({searchTerm: event.target.value});
    }
    // Set the results of the api
    setSearchTopStories(result) {
        this.setState({result});
    }

    // Component did mount gets called after render and gets called only once
    componentDidMount() {
        const {searchTerm} = this.state;

        // Make fetch to API
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
        .then(response => response.json())
        .then(result => this.setSearchTopStories(result))
        .catch(error => error);
    }

    render() {
        // Hello world
        const helloWorld = 'Welcome to the Road to learn Reactjs';
        
        // User exercise
        const user = {
            firstName: 'Jerome',
            lastName: 'James'
        }

        // destructure this.state
        const {
            result,
            searchTerm
        } = this.state;

        if (!result) { return null;}
       
        return (
            <div className="page">
                <header className="App-header">
                    <h1 className="App-title">{helloWorld + ', '
                        + user.firstName + ' ' + user.lastName } </h1>
                </header>
                <div className='interactions'>
                    <Search searchTerm={searchTerm} onSearchChange={this.onSearchChange}>
                    Search
                    </Search>
                </div>
                <Table list={result.hits} searchTerm={searchTerm} onDismiss={this.onDismiss}/>
            </div>
        );
    }
}

// Functional react components are used when we don't need state
const Search = ({searchTerm, onSearchChange, children}) =>
    // Children represent what's inside of a component when used
    // E.G., text, more components, elements, etc.   
    <form>
        {children} <input type='text'
        value={searchTerm}
        onChange={onSearchChange}/>
    </form>

const Table = ({list, searchTerm, onDismiss}) => {

    // Inline style variable examples
    const largeColumn = {
        width: '40%'
    }

    const midColumn = {
        width: '30%'
    }

    const smallColumn = {
        width: '10%'
    }

    return(
        <div className='table'>
        {list.filter(isSearched(searchTerm)).map((item) =>
            <div key={item.objectID} className='table-row'>
                <span style={largeColumn}>
                    <a href={item.url}>{item.title}</a>
                </span>
                <span style={midColumn}> {item.author}</span>
                <span style={smallColumn}> {item.num_comments}</span>
                <span style={smallColumn}> {item.points}</span>
                <span>
                    <Button onClick={() => onDismiss(item.objectID)} className='button-inline'>
                        Dismiss
                    </Button>
                </span>
            </div>
        )}
        </div>
    );
}

const Button = ({onClick, className = '', children}) =>
    <button
        onClick={onClick}
        className={className}
        type='button'>
        {children}
    </button>

export default App;
