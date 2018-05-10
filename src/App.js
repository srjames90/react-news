import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

// Set strings for API call
const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {
    constructor(props) {
        // "this" not allowed in constructor prior to super call
        super(props);
        
        // Set state (searchKey represents current query)
        this.state = {
            results: null,
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
            error: null
        };
        // Bindings
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    }

    onDismiss(id) {
        const {searchKey, results} = this.state;
        const{hits, page} = results[searchKey];
        const isNotId = item => item.objectID !== id;
        const updatedHits = hits.filter(isNotId);
        // Replace list (avoids mutating old list and adhering to React conventions)
        this.setState({results: {...results, [searchKey]: {hits: updatedHits, page}}});
    }

    needsToSearchTopStories(searchTerm) {
        return !this.state.results[searchTerm];
    }

    // Used as part of the synthetic React event, so get an event
    onSearchChange(event) {
        this.setState({searchTerm: event.target.value});
    }

    // Set the results of the api
    setSearchTopStories(result) {
        // extracts hits and page from results
        const {hits, page} = result;
        const {searchKey, results} = this.state;

        // gets the current results object if it exists
        const oldHits = results && results[searchKey]
            ? results[searchKey].hits : [];
        // Apends the old hits with the new hits
        const updatedHits = [...oldHits, ...hits];
        // Set the new hits and the page
        this.setState({
            results: {
                ...results,
                [searchKey]: {hits: updatedHits, page}
            }
        });
    }

    // Perform a new search
    onSearchSubmit(event) {
        const {searchTerm} = this.state;
        // Set searchKey...state is changed, so will call render
        this.setState({searchKey: searchTerm});
        // Check if in cache
        if (this.needsToSearchTopStories(searchTerm)) {
            // Do the fetch
            this.fetchSearchTopStories(searchTerm);
        }
        event.preventDefault();
    }

    fetchSearchTopStories(searchTerm, page = 0) {
        axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
        .then(result => this.setSearchTopStories(result.data))
        .catch(error => this.setState({error}));
    }

    // Component did mount gets called after render and gets called only once
    componentDidMount() {
        const {searchTerm} = this.state;
        // Set search key
        this.setState({searchKey: searchTerm});
        // Make fetch to API
        this.fetchSearchTopStories(searchTerm);
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
            results,
            searchTerm,
            searchKey,
            error
        } = this.state;

        // Add paginaton
        const page = (results && results[searchKey] && results[searchKey].page) || 0;
        // Get the results
        const list = (results && results[searchKey] && results[searchKey].hits) || [];

        return (
            <div className="page">
                <header className="App-header">
                    <h1 className="App-title">{helloWorld + ', '
                        + user.firstName + ' ' + user.lastName } </h1>
                </header>
                <div className='interactions'>
                    <Search searchTerm={searchTerm}
                    onChange={this.onSearchChange}
                    onSubmit={this.onSearchSubmit}>
                    Search
                    </Search>
                </div>
                {error
                    ? <div className='interactions'>
                      <p>Something went wrong.</p>
                      </div>
                    : <Table list={list} onDismiss={this.onDismiss}/>
                }
                <div className='interacitons'>
                    <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
                        Next
                    </Button>
                </div>
            </div>
        );
    }
}

// Functional react components are used when we don't need state
const Search = ({searchTerm, onChange, onSubmit, children}) =>
    // Children represent what's inside of a component when used
    // E.G., text, more components, elements, etc.   
    <form onSubmit={onSubmit}>
        {children} <input type='text'
        value={searchTerm}
        onChange={onChange}/>
        <button type='submit'>
            Submit
        </button>
    </form>

const Table = ({list, onDismiss}) => {

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
        {list.map((item) =>
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
