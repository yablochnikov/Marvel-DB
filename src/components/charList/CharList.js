import { Component } from "react";
import PropTypes from "prop-types";
import "./charList.scss";
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/errorMessage";
import Spinner from "../spinner/spinner";

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
    newItemsLoading: false,
    offset: 0,
    charsEnded: false
  };

  marvelService = new MarvelService();

  componentDidMount = () => {
    this.marvelService
      .getAllCharacters()
      .then(this.onCharLisLoaded)
      .catch(this.onError);
  };

  onRequest = offset => {
    this.onMoreCharactersLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onMoreCharactersLoaded)
      .catch(this.onError);
    console.log(this.state);
  };

  onMoreCharactersLoading = () => {
    this.setState({
      newItemsLoading: true
    });
  };

  onMoreCharactersLoaded = newCharList => {
    let ended = false;
    if (newCharList.lenght < 9) {
      ended = true;
    }

    this.setState({
      charList: [...this.state.charList, ...newCharList],
      loading: false,
      newItemsLoading: false,
      offset: 9 + this.state.offset,
      charEnded: ended
    });
  };

  onCharLisLoaded = charList => {
    this.setState({ charList, loading: false });
  };

  onError = () => {
    this.setState({ loading: false, error: true });
  };

  renderItems(arr) {
    const items = arr.map(item => {
      let imgStyle = { objectFit: "cover" };
      if (
        item.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "unset" };
      }
      return (
        <li
          className='char__item'
          key={item.id}
          onClick={() => this.props.onCharSelected(item.id)}
        >
          <img src={item.thumbnail} alt={item.name} style={imgStyle} />
          <div className='char__name'>{item.name}</div>
        </li>
      );
    });

    return <ul className='char__grid'>{items}</ul>;
  }

  render() {
    const { charList, loading, error, newItemsLoading, offset, charsEnded } =
      this.state;
    const items = this.renderItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;
    return (
      <div className='char__list'>
        <ul className='char__grid'>
          {errorMessage}
          {spinner}
          {content}
        </ul>
        <button
          style={{ display: charsEnded ? "none" : "block" }}
          className='button button__main button__long'
          onClick={() => {
            this.onRequest(offset + 9);
          }}
          disabled={newItemsLoading}
        >
          <div className='inner'>load more</div>
        </button>
      </div>
    );
  }
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired
};

export default CharList;
