class StatusComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      status: ""
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.checkStatus(), 5000);
  }

  checkStatus() {
    fetch("/status").then(res => res.json()).then(result => {
      this.setState({
        isLoaded: true,
        status: result.status
      });
    }, // Note: it's important to handle errors here
    // instead of a catch() block so that we don't swallow
    // exceptions from actual bugs in components.
    error => {
      this.setState({
        isLoaded: true,
        error
      });
    });
  }

  render() {
    const {
      error,
      isLoaded,
      status
    } = this.state;

    if (error) {
      return /*#__PURE__*/React.createElement("div", null, "Error: ", error.message);
    } else if (!isLoaded) {
      return /*#__PURE__*/React.createElement("div", null, "Loading...");
    } else {
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, "The server status is:"), /*#__PURE__*/React.createElement("p", null, status));
    }
  }

}


ReactDOM.render(
 <StatusComponent />,
 document.getElementById('status')
 );