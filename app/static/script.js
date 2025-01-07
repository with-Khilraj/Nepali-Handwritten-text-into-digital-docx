document.getElementById('upload-button').addEventListener('click', function() {
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('selected-image').src = e.target.result;
            document.getElementById('selected-image').style.display = 'block';
            document.getElementById('loading-bar').style.display = 'block';
            document.getElementById('reset-button').style.display = 'block';

            const formData = new FormData();
            formData.append('file', file);

            fetch('/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                setTimeout(function() {
                    document.getElementById('loading-bar').style.display = 'none';
                    document.getElementById('extracted-text').textContent = data.text;
                    document.getElementById('extracted-text').readOnly = false; // Make text editable
                    // document.getElementById('download-docx-button').style.display = 'block';
                    document.getElementById('download-docx-form').style.display = 'block';
                    document.getElementById('docx-text').value = data.text;
                }, 3000);
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('loading-bar').style.display = 'none';
            });
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('reset-button').addEventListener('click', function() {
    document.getElementById('selected-image').src = '/static/assets/upload.png';
    document.getElementById('extracted-text').textContent = 'Your text will appear here.';
    document.getElementById('extracted-text').readOnly = true; 
    document.getElementById('reset-button').style.display = 'none';
    document.getElementById('download-docx-form').style.display = 'none';
    document.getElementById('file-input').value = ''; 
});

document.getElementById('download-docx-button').addEventListener('click', function() {
    document.getElementById('download-docx-form').submit();
});


document.querySelectorAll('.accordion').forEach(button => {
    button.addEventListener('click', () => {
        const panel = button.nextElementSibling;
        
        button.classList.toggle('active');
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + 'px';
        } 
    });
});


// document.getElementById('download-docx-button').addEventListener('click', function() {
//     const text = document.getElementById('extracted-text').value;
//     const doc = new window.docx.Document({
//         sections: [{
//             properties: {},
//             children: [
//                 new window.docx.Paragraph({
//                     children: [
//                         new window.docx.TextRun(text)
//                     ]
//                 })
//             ]
//         }]
//     });

//     window.docx.Packer.toBlob(doc).then(blob => {
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'extracted_text.docx';
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         URL.revokeObjectURL(url);
//     });
// });
