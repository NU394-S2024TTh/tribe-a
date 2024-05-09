import React, { useState } from 'react';
import { sentimentAnalyzer } from '../../../../processes/sentimentAnalyzer'

export default function ReviewsInput() {
    const [input, setInput] = useState<string>('');
    const [reviews, setReviews] = useState<string[]>([]); 

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // splits reviews by new line  
        const reviews = input.trim().split('\n');
        console.log(input.trim().split('\n'));
        const sentiment = await sentimentAnalyzer.getAverageSentiment(reviews);
    };
    
    return (
        <div className="flex justify-center items-center my-5">
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <label htmlFor="textInput" className="block mb-2">Enter reviews:</label>
                <textarea
                    id="textInput"
                    value={input}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:border-custom-theme-2"
                    rows={4}
                />
                <button type="submit" className="mt-2 w-full bg-custom-theme-2b text-white px-4 py-2 rounded-md hover:bg-custom-theme-2 focus:outline-none focus:bg-custom-theme-2">Submit</button>
            </form>
        </div>
    );
}