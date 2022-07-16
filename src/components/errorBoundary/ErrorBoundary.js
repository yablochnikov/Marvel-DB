import { Component } from "react";
import ErrorMessage from "../errorMessage/errorMessage";
class ErrorBoundary extends Component {
  state = {
    error: false
  };

  // static getDerivedStateFromError(error) {
  //   return { error: true };
  // }

  componentDidCatch = (error, info) => {
    console.log(error, info);
    this.setState({ error: true });
  };

  render() {
    if (this.state.error) {
      return (
        <h2>
          <ErrorMessage />
        </h2>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
