import React from "react";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { errMsg: "" };
    }
  
    static getDerivedStateFromError(error) {
      // localStorage.clear();
      // Update state so the next render will show the fallback UI.
      return { errMsg: error.message };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
    }
  
    render() {
      if (this.state.errMsg) {
        // You can render any custom fallback UI
        return <h1>{this.state.errMsg}</h1>;
      }
  
      return this.props.children; 
    }
  }