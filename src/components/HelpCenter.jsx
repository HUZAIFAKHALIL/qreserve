'use client';

import { useState } from 'react';
import { useCurrentUser } from '@/Contexts/ChatAuthHelper';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  QuestionMarkCircleIcon 
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

// FAQ categories and questions
const faqData = [
  {
    category: "Account",
    questions: [
      {
        question: "How do I create an account?",
        answer: "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. Fill in your email address, create a password, and follow the verification instructions sent to your email."
      },
      {
        question: "I forgot my password. How do I reset it?",
        answer: "Click on the 'Login' button and then select 'Forgot Password'. Enter your email address and follow the instructions sent to your email to create a new password."
      },
      {
        question: "How do I update my account information?",
        answer: "Once logged in, navigate to your profile by clicking on your name or profile icon in the top right corner. Select 'Account Settings' to update your personal information, contact details, or preferences."
      }
    ]
  },
  {
    category: "Bookings",
    questions: [
      {
        question: "How do I make a new booking?",
        answer: "From the dashboard, click on 'New Booking' or 'Book Service'. Select the service you want, choose your preferred date and time, and follow the prompts to complete your booking."
      },
      {
        question: "Can I modify or cancel my existing booking?",
        answer: "Yes, you can manage your bookings from the 'My Bookings' section. Select the booking you wish to modify or cancel and follow the instructions. Please note that cancellations may be subject to our cancellation policy."
      },
      {
        question: "What is your cancellation policy?",
        answer: "Bookings can be cancelled up to 24 hours before the scheduled time without penalty. Cancellations made less than 24 hours in advance may incur a fee of up to 50% of the service cost. No-shows are charged the full amount."
      }
    ]
  },
  {
    category: "Payments",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for corporate accounts."
      },
      {
        question: "When will I be charged for my booking?",
        answer: "For standard bookings, we charge your payment method at the time of booking. For specialized services, we may take a deposit at booking with the balance due after service completion."
      },
      {
        question: "How do I request a refund?",
        answer: "To request a refund, go to 'My Bookings', select the relevant booking, and click on 'Request Refund'. Fill out the form with your reason for requesting a refund, and our team will review your request within 2-3 business days."
      }
    ]
  },
  {
    category: "Technical Issues",
    questions: [
      {
        question: "The app is not loading correctly. What should I do?",
        answer: "First, try refreshing the page. If that doesn't work, clear your browser cache and cookies, or try using a different browser. If problems persist, contact our support team with details about the issue."
      },
      {
        question: "I'm having trouble uploading documents. What file formats are supported?",
        answer: "We support PDF, DOC, DOCX, JPG, and PNG files. The maximum file size is 10MB. Make sure your file meets these requirements. If you're still having issues, try compressing the file or converting it to a supported format."
      },
      {
        question: "The confirmation email hasn't arrived. What should I do?",
        answer: "First, check your spam or junk folder. If you don't see it there, go to 'My Bookings' to verify your booking was completed successfully. You can request a new confirmation email from this section. If you still don't receive it, contact our support team."
      }
    ]
  }
];

// Individual FAQ Item component
const FAQItem = ({ question, answer, isOpen, toggleOpen }) => {
  return (
    <div className="border-b border-gray-200">
      <button 
        onClick={toggleOpen}
        className="w-full text-left py-4 px-3 flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-lg"
      >
        <span className="font-medium text-gray-900">{question}</span>
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        )}
      </button>
      
      {isOpen && (
        <div className="py-3 px-3 pb-4 text-gray-600">
          <p className="whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  );
};

// FAQ Category component
const FAQCategory = ({ category, questions }) => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3 text-gray-900">{category}</h3>
      <div className="bg-white rounded-lg shadow">
        {questions.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openQuestion === index}
            toggleOpen={() => toggleQuestion(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default function HelpCenter() {
  const { userId } = useCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFAQs, setFilteredFAQs] = useState(faqData);

  // Handle search functionality
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term.trim()) {
      setFilteredFAQs(faqData);
      return;
    }

    // Filter FAQs based on search term
    const filtered = faqData.map(category => {
      const matchingQuestions = category.questions.filter(
        faq => 
          faq.question.toLowerCase().includes(term) || 
          faq.answer.toLowerCase().includes(term)
      );

      if (matchingQuestions.length > 0) {
        return {
          ...category,
          questions: matchingQuestions
        };
      }
      
      return null;
    }).filter(Boolean);

    setFilteredFAQs(filtered);
  };

  // If user is not logged in, optionally restrict access
  if (!userId) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Please log in to access our Help Center</h2>
          <p className="mt-2">You need to be logged in to view our frequently asked questions and support resources.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mt-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find answers to frequently asked questions or use our live chat for more specific inquiries.
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input 
            type="search" 
            value={searchTerm}
            onChange={handleSearch}
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500" 
            placeholder="Search FAQs..." 
          />
        </div>
      </div>

      {/* Display no results message if needed */}
      {filteredFAQs.length === 0 && (
        <div className="text-center py-8">
          <QuestionMarkCircleIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
          <p className="text-gray-600">We couldn't find any FAQs matching your search</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilteredFAQs(faqData);
            }}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
            Clear search
          </button>
        </div>
      )}

      {/* Display FAQs */}
      <div>
        {filteredFAQs.map((category, index) => (
          <FAQCategory 
            key={index} 
            category={category.category} 
            questions={category.questions} 
          />
        ))}
      </div>

      {/* Help message */}
      <div className="mt-10 text-center bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-2">Still need help?</h3>
        <p className="text-gray-600 mb-4">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => {
              // You can connect this to your ChatWidget component
              const chatButton = document.querySelector('[aria-label="Open support chat"]');
              if (chatButton) chatButton.click();
            }}
            className={clsx(
              "flex items-center px-4 py-2 rounded-full",
              "bg-black text-white hover:bg-gray-800",
              "transition-colors duration-200"
            )}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
            Chat with Support
          </button>
          <a 
            href="mailto:support@example.com" 
            className={clsx(
              "flex items-center px-4 py-2 rounded-full",
              "bg-gray-100 text-gray-800 hover:bg-gray-200",
              "transition-colors duration-200"
            )}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Email Support
          </a>
        </div>
      </div>
    </div>
  );
}