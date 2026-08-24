import { X } from "lucide-react";
import ModalWrapper from "../wrapper/ModalWrapper";

type Lang = { label: string; region: string };

const LANGUAGES: Lang[] = [
    { label: "English", region: "UK" },
    { label: "English", region: "US" },
    { label: "French", region: "France" },
    { label: "German", region: "Germany" },
    { label: "Italian", region: "Italy" },
    { label: "Japanese", region: "Japan" },
    { label: "Chinese", region: "China" },
    { label: "Russian", region: "Russia" },
    { label: "Portuguese", region: "Portugal" },
    { label: "Arabic", region: "Saudi Arabia" },
];

type LanguageModalProps = {
    isOpen: boolean;
    onClose: () => void;
    selectedLang: Lang;
    onSelect: (lang: Lang) => void;
};

const LanguageModal = ({
    isOpen,
    onClose,
    selectedLang,
    onSelect,
}: LanguageModalProps) => {
    const isSelected = (lang: Lang) =>
        selectedLang.label === lang.label && selectedLang.region === lang.region;

    const LangButton = ({ lang, compact }: { lang: Lang; compact?: boolean }) => {
        const selected = isSelected(lang);
        return (
            <button
                onClick={() => onSelect(lang)}
                className={
                    compact
                        ? `px-3 sm:px-4 py-2 w-24 sm:w-28 rounded-lg text-sm font-medium transition-colors shrink-0 ${selected ? "bg-primary-brown text-white" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`
                        : `text-left px-3 sm:px-4 py-2 rounded-lg text-sm transition-colors ${selected ? "bg-primary-brown text-white" : "hover:bg-gray-50 text-gray-800"}`
                }
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
            >
                <div className={compact ? "font-semibold" : "font-medium"}>
                    {lang.label}
                </div>
                <div className={`text-xs ${selected ? "opacity-80" : "text-gray-400"}`}>
                    {lang.region}
                </div>
            </button>
        );
    };

    return (
        <ModalWrapper isOpen={isOpen}>
            <div
                className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 pt-10 sm:pt-4 overflow-y-auto"
                onClick={onClose}
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
            >
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                <div
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[560px] max-h-[85vh] sm:max-h-[70vh] p-5 sm:p-6 overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <X size={24} className="sm:hidden" />
                        <X size={28} className="hidden sm:block" />
                    </button>

                    <div className="flex justify-start mt-10 mb-6">
                        <div className="border-b-2 border-primary-brown pb-1 px-2">
                            <span className="text-sm font-semibold text-primary-brown">
                                Language
                            </span>
                        </div>
                    </div>

                    <p className="text-sm font-semibold text-gray-900 mb-3">
                        Suggested languages and regions
                    </p>
                    <div className="flex flex-wrap gap-3 mb-6">
                        {LANGUAGES.slice(0, 2).map((lang) => (
                            <LangButton
                                key={`s-${lang.label}-${lang.region}`}
                                lang={lang}
                                compact
                            />
                        ))}
                    </div>

                    <p
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                        className="text-sm font-semibold pt-6 sm:pt-10 text-gray-900 mb-3"
                    >
                        Choose a language and region
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {LANGUAGES.map((lang) => (
                            <LangButton key={`${lang.label}-${lang.region}`} lang={lang} />
                        ))}
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default LanguageModal;