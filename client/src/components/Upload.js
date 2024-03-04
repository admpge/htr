import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadComponent = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [previewSrc, setPreviewSrc] = useState('');
    const navigate = useNavigate();

    const handleFileChange = event => {
        const file = event.target.files[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async event => {
        event.preventDefault();

        if (!file) {
            alert('Please select a file first!');
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Upload successful', data.text);
                navigate('/editor', { state: { text: data.text } });
            } else {
                alert('Upload failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error uploading the file');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-start h-screen bg-gray-800 p-4 pt-20">
            <div className="bg-gray-200 text-black p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6">Handwritten Note Digitiser</h1>
                <form onSubmit={handleSubmit} className="flex flex-col items-center">
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer bg-blue-700 text-white rounded p-2 hover:bg-blue-800 transition duration-300 ease-in-out mb-2"
                    >
                        Choose file
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            required
                            accept="image/jpeg, image/png"
                        />
                    </label>
                    <span id="file-name" className="text-gray-600 mt-1">
                        {file ? file.name : 'No file chosen'}
                    </span>
                    {isLoading ? (
                        <div className="flex justify-center items-center mt-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        previewSrc && (
                            <div className="mt-4 flex flex-col items-center">
                                <img
                                    src={previewSrc}
                                    alt="Preview"
                                    className="max-w-xs rounded-lg shadow-lg"
                                />
                                <button
                                    type="submit"
                                    className="mt-4 bg-blue-700 text-white rounded p-2 hover:bg-blue-800 transition duration-300 ease-in-out"
                                >
                                    Upload
                                </button>
                            </div>
                        )
                    )}
                </form>
            </div>
        </div>
    );
};

export default UploadComponent;