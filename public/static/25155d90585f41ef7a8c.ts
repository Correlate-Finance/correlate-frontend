Office.onReady(function () {
  Office.context.ui.addHandlerAsync(
    Office.EventType.DialogParentMessageReceived,
    onMessageFromParent,
  );
});
function onMessageFromParent(arg) {
  var messageFromParent = JSON.parse(arg.message);
  document.querySelector('h2').textContent = messageFromParent.name;
}
