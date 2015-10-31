var React = require('react');

var CurrentProjectStore = require('../stores/CurrentProjectStore');
var ErrorList = require('./ErrorList');
var ErrorStore = require('../stores/ErrorStore');
var ProjectStore = require('../stores/ProjectStore');
var Preview = require('./Preview');

function calculateState() {
  var projectKey = CurrentProjectStore.getKey();

  return {
    project: ProjectStore.get(projectKey),
    hasErrors: ErrorStore.anyErrors(projectKey),
    errors: ErrorStore.getErrors(projectKey),
  };
}

var Output = React.createClass({
  propTypes: {
    onErrorClicked: React.PropTypes.func.isRequired,
  },

  getInitialState: function() {
    return calculateState();
  },

  componentDidMount: function() {
    CurrentProjectStore.addChangeListener(this._onChange);
    ErrorStore.addChangeListener(this._onChange);
    ProjectStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    CurrentProjectStore.removeChangeListener(this._onChange);
    ErrorStore.removeChangeListener(this._onChange);
    ProjectStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(calculateState());
  },

  render: function() {
    if (this.state.hasErrors) {
      return (
        <ErrorList
          {...this.state.errors}
          onErrorClicked={this.props.onErrorClicked}
        />
      );
    }
    if (this.state.project) {
      return (
        <Preview project={this.state.project} />
      );
    }
    return null;
  },
});

module.exports = Output;