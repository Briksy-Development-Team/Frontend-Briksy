import { X, Square } from "lucide-react";
import ModalWrapper from "../wrapper/ModalWrapper";

type AiVoiceModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const AiVoiceModal = ({ isOpen, onClose }: AiVoiceModalProps) => {
    if (!isOpen) return null;

    return (
        <ModalWrapper isOpen={isOpen}>
            <div className="fixed inset-0 z-[99999]">
                
                <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={onClose}
                />

                
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-[480px] rounded-[24px] bg-white p-8 pt-10 shadow-2xl">

                        
                        <button
                            onClick={onClose}
                            className="absolute top-6 left-6 text-gray-500 hover:text-black transition-colors"
                        >
                            <X size={24} strokeWidth={1.5} />
                        </button>

                        <div className="mt-8">
                            
                            <div className="text-left mb-12">
                                <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3">
                                    AI Voice Assistant
                                </p>

                                <h2 className="text-[32px] font-semibold text-gray-900 leading-[1.1]">
                                    How can I help you
                                    <br />
                                    find your next property?
                                </h2>
                            </div>

                            
                            <div className="flex items-center justify-center gap-1.5 mb-10 h-16">
                                {[16, 28, 40, 24, 48, 32, 44, 24, 36, 28, 16].map(
                                    (height, i) => (
                                        <div
                                            key={i}
                                            className="w-1.5 bg-gray-400 rounded-full animate-pulse"
                                            style={{
                                                height: `${height}px`,
                                                animationDelay: `${i * 0.15}s`,
                                            }}
                                        />
                                    )
                                )}
                            </div>

                            
                            <div className="flex justify-center">
                                <button
                                    onClick={onClose}
                                    className="w-14 h-14 bg-[#253221] rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                                >
                                    <Square
                                        size={16}
                                        fill="white"
                                        className="text-white"
                                    />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default AiVoiceModal;