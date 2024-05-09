import React, { useState, useEffect } from 'react';
import sentimentAnalyzer from '../../processes/sentimentAnalyzer.mjs';

export default function ReviewsInput() {
    const [input, setInput] = useState<string>('');
    const [reviews, setReviews] = useState<string[]>([]); 

    // run sentiment analysis on reviews state change
    async function handleReviewsChange (reviews: string[]) {
        console.log("Reviews state changed: ", reviews);
        const sentiments = await sentimentAnalyzer.getSentiments(reviews); // run sentiment analysis on reviews
        
        for (let i = 0; i < reviews.length; i++) {
            alert(`Review: ${reviews[i]}\nSentiment: ${sentiments[i]}`); // alert sentiment analysis results
        }
        
        return sentiments;
    }

    useEffect(() => {handleReviewsChange(reviews)}, [reviews]);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // splits reviews by new line  
        setReviews(input.trim().split('\n'));
        // console.log(input.trim().split('\n'));
    };
    
    return (
        <div className="flex justify-center items-center my-5">
            <form onSubmit={handleSubmit} className="w-full max-w-sm">
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