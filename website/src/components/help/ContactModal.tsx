import React, { useRef, useState } from "react";
import { X, ChevronDown, Plus } from "lucide-react";
import ModalWrapper from "../wrapper/ModalWrapper";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [screenshot, setScreenshot] = useState<File | null>(null);

    const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!["image/png", "image/jpeg"].includes(file.type)) {
            alert("Please select a PNG or JPG image.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert("File size must be less than 10MB.");
            return;
        }

        setScreenshot(file);
    };
    return (
        <ModalWrapper isOpen={isOpen}>
            <div className="fixed inset-0 z-50 flex items-center justify-center  p-3 md:p-4 font-helvetica">
                <div className=" flex w-full max-w-[55rem] max-h-[95vh] flex-col rounded-[1.5rem] md:rounded-[2rem] bg-white shadow-xl">
                    <div className=" w-full h-[5rem] px-5 pt-5  rounded-[1.5rem] md:rounded-[2rem]  ">
                        <button
                            onClick={onClose}
                            className="  z-10 bg-white rounded-full p-1 text-primary-brown transition-transform hover:scale-110"
                        >
                            <X className="w-5 h-5 md:w-7 md:h-7" strokeWidth={1.5} />
                        </button>
                    </div>

                    <div
                        className="overflow-y-auto px-6 md:px-12   custom-scrollbar"
                        data-lenis-prevent
                    >
                        <div className="">
                            <div className="mb-6 md:mb-8 ">
                                <h2 className="text-[1.5rem] md:text-[2rem] font-medium text-primary-brown">
                                    Still can't find an answer?
                                </h2>
                                <p className="mt-1 md:mt-2 text-[0.75rem] md:text-[0.875rem] text-primary-light-brown">
                                    Send us a message and we'll reply within one business day.
                                </p>
                            </div>

                            <form
                                className="space-y-4 md:space-y-6"
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <div>
                                    <label className="mb-1.5 md:mb-2 block text-[0.75rem] md:text-[0.875rem] font-medium text-primary-brown">
                                        What do you need help with?
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            readOnly
                                            placeholder="Choose a topic"
                                            className="w-full cursor-pointer rounded-xl border border-white-100 py-3 pl-4 pr-10 md:py-4 md:pl-4 md:pr-12 text-[0.75rem] md:text-[0.875rem] text-primary-brown outline-none placeholder:text-[#A89F95]"
                                        />
                                        <ChevronDown className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-[#A89F95] w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                </div>

                                
                                <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 md:mb-2 block text-[0.75rem] md:text-[0.875rem] font-medium text-primary-brown">
                                            Full name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Jordan Fairweather"
                                            className="w-full rounded-xl border border-white-100 p-3 md:p-4 text-[0.75rem] md:text-[0.875rem] text-primary-brown outline-none placeholder:text-[#A89F95]"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 md:mb-2 block text-[0.75rem] md:text-[0.875rem] font-medium text-primary-brown">
                                            Email address
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            className="w-full rounded-xl border border-white-100 p-3 md:p-4 text-[0.75rem] md:text-[0.875rem] text-primary-brown outline-none placeholder:text-[#A89F95]"
                                        />
                                    </div>
                                </div>

                                
                                <div>
                                    <label className="mb-1.5 md:mb-2 flex items-center gap-1.5 md:gap-2 text-[0.75rem] md:text-[0.875rem] font-medium text-primary-brown">
                                        Related enquiry or profile{" "}
                                        <span className="text-[0.65rem] md:text-[0.75rem] text-[#A89F95] font-normal">
                                            optional
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Paste a link, or an enquiry reference"
                                        className="w-full rounded-xl border border-white-100 p-3 md:p-4 text-[0.75rem] md:text-[0.875rem] text-primary-brown outline-none placeholder:text-[#A89F95]"
                                    />
                                </div>

                                
                                <div>
                                    <label className="mb-1.5 md:mb-2 block text-[0.75rem] md:text-[0.875rem] font-medium text-primary-brown">
                                        Message
                                    </label>
                                    <textarea
                                        rows={4}
                                        placeholder="Tell us what happened, and what you were expecting instead."
                                        className="w-full resize-none rounded-xl border border-white-100 p-3 md:p-4 text-[0.75rem] md:text-[0.875rem] text-primary-brown outline-none placeholder:text-[#A89F95] md:rows-5"
                                    />
                                </div>

                                
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg"
                                    className="hidden"
                                    onChange={handleScreenshotChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex w-full items-center justify-between  rounded-xl border border-dashed border-white-100 p-3 md:p-4 transition-colors hover:bg-gray-50 flex-col sm:flex-row gap-2 sm:gap-0"
                                >
                                    <div className="flex items-center gap-2 md:gap-3 text-[0.75rem] md:text-[0.875rem] text-primary-light-brown">
                                        <Plus className="w-4 h-4 md:w-4 md:h-4" />
                                        <span>
                                            {screenshot ? screenshot.name : "Attach a screenshot"}
                                        </span>
                                    </div>
                                    <span className="text-[0.65rem] md:text-[0.75rem] text-[#A89F95]">
                                        {screenshot
                                            ? `${(screenshot.size / 1024 / 1024).toFixed(2)} MB`
                                            : "PNG or JPG, up to 10MB"}
                                    </span>
                                </button>

                                
                                <div className="pt-1 md:pt-2">
                                    <label className="flex items-center gap-2 md:gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 md:h-5 md:w-5 rounded border-white-100 accent-primary-brown text-primary-brown focus:ring-primary-brown cursor-pointer"
                                        />
                                        <span className="text-[0.75rem] md:text-[0.875rem] text-primary-brown">
                                            Email me a copy of this message
                                        </span>
                                    </label>
                                </div>

                                
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-2 md:pt-4">
                                    <button
                                        type="submit"
                                        className="rounded-full w-full sm:w-auto bg-[#3D2C1E] px-6 py-2.5 md:px-8 md:py-3.5 text-[0.75rem] md:text-[0.875rem] font-medium text-white transition-opacity hover:opacity-90"
                                    >
                                        Send message
                                    </button>
                                    <span className="text-[0.65rem] md:text-[0.75rem] text-[#A89F95] text-center sm:text-left">
                                        We never share your details with providers.
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default ContactModal;
