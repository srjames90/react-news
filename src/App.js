import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function isSearched(searchTerm) {
    // Returned function has access to both item and searchTerm
    return item => item.title
    .toLowerCase().includes(searchTerm.toLowerCase());
}

class App extends Component {
    constructor(props) {
        // "this" not allowed in constructor prior to super call
        super(props);
        // Render list example
        // Remember, each element need a key
        const list = [
            {
                title: 'React',
                url: 'https://facebook.github.io/react/',
                author: 'Jordan Walke',
                num_comments: 3,
                points: 4,
                objectID: 0
            },
            {
                title: 'Redux',
                url: 'https://github.com/reactjs/redux',
                author: 'Dan Abramov, Andrew Clark',
                num_comments: 2,
                points: 5,
                objectID: 1
            }
        ];
        // Set state
        this.state = {
            list,
            searchTerm: ''
        };
        // Bindings
        this.onDismiss = this.onDismiss.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.search
    }

    onDismiss(id) {
        const isNotId = item => item.objectID !== id;
        const updatedList = this.state.list.filter(isNotId);
        // Replace list (avoids mutating old list and adhering to React conventions)
        this.setState({list: updatedList});
    }


    // Used as part of the synthetic React event, so get an event
    onSearchChange(event) {
        // Why?
        this.setState({searchTerm: event.target.value});
        // Try something different, then comment out

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
            list,
            searchTerm
        } = this.state;
       
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">{helloWorld + ', '
                        + user.firstName + ' ' + user.lastName } </h1>
                </header>
                <Search searchTerm={searchTerm} onSearchChange={this.onSearchChange}>
                Search
                </Search>
                <Table list={list} searchTerm={searchTerm} onDismiss={this.onDismiss}/>
            </div>
        );
    }
}

// Functional react components are used when we don't need state
function Search(props) {
    const {
        searchTerm,
        onSearchChange,
        children
    } = props;
    // Children represent what's inside of a component when used
    // E.G., text, more components, elements, etc.   
    return(
        <form>
            {children} <input type='text'
            value={searchTerm}
            onChange={onSearchChange}/>
        </form>
    );
}

function Table(props) {
    const {
        list,
        searchTerm,
        onDismiss
    } = props;
        
    return(
        <div>
        {list.filter(isSearched(searchTerm)).map((item) =>
            <div key={item.objectID}>
                <span>
                    <a href={item.url}>{item.title}</a>
                </span>
                <span> {item.author}</span>
                <span> {item.num_comments}</span>
                <span> {item.points}</span>
                <Button onClick={() => onDismiss(item.objectID)}>
                    Dismiss
                </Button>
            </div>
        )}
        </div>
    );
}

function Button(props) {
    const {
        onClick,
        className = '',
        children
    } = props;
    return(
        <button
            onClick={onClick}
            className={className}
            type='button'>
            {children}
        </button>
    );
}

export default App;
