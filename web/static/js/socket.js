import {Socket} from "phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}})

socket.connect()

const createSocket = (topicId) => {
  let channel = socket.channel(`comments:${topicId}`, {})
  channel.join()
    .receive("ok", ({ comments }) => renderComments(comments))
    .receive("error", resp => { console.log("Unable to join", resp) })

  document.querySelector('button').addEventListener('click', () => {
    const content = document.querySelector('textarea').value;
    channel.push('comment:add', { content });
  });

  channel.on(`comments:${topicId}:new`, ({comment}) => renderComment(comment));
}

const list = document.querySelector('.collection');

const renderComments = (comments) => {
  list.innerHTML = comments.map(comment => commentTemplate(comment)).join('');
};

const renderComment = (comment) => {
  list.innerHTML += commentTemplate(comment);
};

const commentTemplate = (comment) => `<li class="collection-item">${comment.content}</li>`;

window.createSocket = createSocket;
