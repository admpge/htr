import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { useLocation } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';

const EditorPage = () => {
    const location = useLocation();
    const [text, setText] = useState('');

    useEffect(() => {
        if (location.state?.text) {
            setText(location.state.text);
        }
    }, [location]);

    const handleTextChange = content => {
        setText(content);
    };

    const handleDownload = () => {
        const element = document.createElement('a');
        const file = new Blob([text], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'digitized_text.txt';
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="min-h-screen bg-gray-800 text-black">
            <div className="container mx-auto py-12">
                <div className="bg-gray-100 p-9 rounded-lg shadow-lg">
                    <ReactQuill
                        theme="snow"
                        value={text}
                        onChange={handleTextChange}
                        className="mb-20"
                        style={{ height: '300px' }}
                    />
                    <div className="flex justify-center">
                        <button
                            onClick={handleDownload}
                            className="mt-4 bg-blue-700 text-white rounded p-2 hover:bg-blue-800 transition duration-300 ease-in-out w-full"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorPage;
