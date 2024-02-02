import { $ } from './utils/dom';
import { codeEditor } from './monaco';

/**
 * @type {HTMLButtonElement}
 */
const $saveButton = $('#save-code');

$saveButton.addEventListener('click', download);

function download() {
    const content = "\ufeff" + codeEditor.getModel().getValue();
    const fileName = `jsplay-${new Date().toISOString()}.js`;

    var file = new File(
        [content],
        fileName,
        {
            type: "text/plain:charset=UTF-8"
        }
    );

    const url = window.URL.createObjectURL(file);

    var a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = file.name;
    a.click();
    window.URL.revokeObjectURL(url);
}