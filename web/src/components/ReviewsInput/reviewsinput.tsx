import React, { useState } from 'react';

interface ReviewsInputProps {
    handleSubmit: (reviews: string[]) => void;
}
  
export default function ReviewsInput({ handleSubmit }: ReviewsInputProps) {
    const [input, setInput] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(event.target.value);
    };

    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const reviews: string[] = input.trim().split('\n');
        handleSubmit(reviews);
    };

    return (
        <div className="flex justify-center items-center my-5">
            <form onSubmit={submitForm} className="w-full max-w-sm">
                <label htmlFor="textInput" className="block mb-2 text-white">Enter reviews:</label>
                <textarea
                    id="textInput"
                    value={input}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:border-custom-theme-2"
                    rows={4}
                />
                <button type="submit" className="mt-2 w-full bg-custom-theme-2 text-white px-4 py-2 rounded-md hover:bg-custom-theme-2b focus:outline-none focus:bg-custom-theme-2 border border-white">Submit</button>
            </form>
        </div>
    );
}