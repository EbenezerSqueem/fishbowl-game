const onFocus = (e) => {
    e.target.placeholder = "";
}

const onBlur = (e, text) => {
    e.target.placeholder = text;
}

export { onFocus, onBlur };