import React from 'react';

const ContactSection = () => {
  return (
    <section className="bg-orange-50 py-16 px-6">
      <div className="max-w-6xl mx-auto md:flex items-start gap-12">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h2 className="text-3xl font-bold mb-4">Have Questions? We’re Here!</h2>
          <p className="text-gray-600 mb-6">
            Fill in the form and our team will get back to you as soon as possible.
          </p>
          <ul className="text-sm text-gray-700 space-y-2">
            <li><strong>Email:</strong> support@mybeauty.vn</li>
            <li><strong>Phone:</strong> (+84) 123-456-789</li>
            <li><strong>Address:</strong> 123 Beauty Street, HCM City</li>
          </ul>
        </div>

        <div className="md:w-1/2 bg-white rounded-lg shadow-md p-6">
          <form className="space-y-4">
            <div className="flex gap-4">
              <input type="text" placeholder="First Name" className="w-1/2 border rounded px-4 py-2" />
              <input type="text" placeholder="Last Name" className="w-1/2 border rounded px-4 py-2" />
            </div>
            <input type="email" placeholder="Email Address" className="w-full border rounded px-4 py-2" />
            <input type="text" placeholder="Mobile Number" className="w-full border rounded px-4 py-2" />
            <textarea placeholder="Your Message..." className="w-full border rounded px-4 py-2 h-28"></textarea>
            <button type="submit" className="bg-rose-600 text-white px-6 py-2 rounded hover:bg-rose-500">
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
