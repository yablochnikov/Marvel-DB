import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./charList.scss";
import MarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/errorMessage";
import Spinner from "../spinner/spinner";

const CharList = props => {
  const [charList, setCharList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newItemsLoading, setNewItemsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [charsEnded, setCharsEnded] = useState(false);

  const marvelService = new MarvelService();

  useEffect(() => {
    onRequest();
  }, []);

  const onRequest = offset => {
    onMoreCharactersLoading();
    marvelService
      .getAllCharacters(offset)
      .then(onMoreCharactersLoaded)
      .catch(onError);
  };

  const onMoreCharactersLoading = () => {
    setNewItemsLoading(true);
  };

  const onMoreCharactersLoaded = newCharList => {
    let ended = false;

    if (newCharList.length < 9) {
      ended = true;
    }

    setCharList(charlist => [...charList, ...newCharList]);
    setLoading(false);
    setNewItemsLoading(newItemLoading => false);
    setOffset(offset => offset + 9);
    setCharsEnded(charsEnded => ended);
  };

  const onError = () => {
    setError(true);
    setLoading(false);
  };

  const itemRefs = useRef([]);

  const onCharFocus = id => {
    itemRefs.current.forEach(item =>
      item.classList.remove("char__item_selected")
    );
    itemRefs.current[id].classList.add("char__item_selected");
    itemRefs.current[id].focus();
  };

  function renderItems(arr) {
    const items = arr.map((item, i) => {
      let imgStyle = { objectFit: "cover" };
      if (
        item.thumbnail ===
        "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
      ) {
        imgStyle = { objectFit: "unset" };
      }

      return (
        <li
          tabIndex={0}
          ref={el => (itemRefs.current[i] = el)}
          className='char__item'
          key={item.id}
          onClick={() => {
            props.onCharSelected(item.id);
            onCharFocus(i);
          }}
          onKeyPress={e => {
            if (e.key === "" || e.key === "Enter") {
              props.onCharSelected(item.id);
              onCharFocus(i);
            }
          }}
        >
          <img src={item.thumbnail} alt={item.name} style={imgStyle} />
          <div className='char__name'>{item.name}</div>
        </li>
      );
    });

    return <ul className='char__grid'>{items}</ul>;
  }

  const items = renderItems(charList);

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
          onRequest(offset + 9);
        }}
        disabled={newItemsLoading}
      >
        <div className='inner'>load more</div>
      </button>
    </div>
  );
};

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired
};

export default CharList;
