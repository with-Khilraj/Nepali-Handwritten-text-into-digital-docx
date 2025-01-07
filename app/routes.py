import os
from flask import current_app as app, current_app as app, request, redirect, url_for, render_template, jsonify
from werkzeug.utils import secure_filename
from ocr.ocr import ocr_image
from docx import Document
from flask import send_file
import io

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/faq')
def faq():
    return render_template('faq.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        
        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            extracted_text = ocr_image(file_path)
            return jsonify({"text": extracted_text})
    return render_template('upload.html')



@app.route('/download_docx', methods=['POST'])
def download_docx():
    text = request.form.get('text', '')
    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Create a Word document
    doc = Document()
    doc.add_paragraph(text)

    # Save the document to a byte stream
    file_stream = io.BytesIO()
    doc.save(file_stream)
    file_stream.seek(0)

    return send_file(
        file_stream,
        as_attachment=True,
        download_name='extracted_text.docx',
        mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )

if __name__ == '__main__':
    app.run(debug=True)
