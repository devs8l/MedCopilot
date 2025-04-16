import React, { useState, useRef, useEffect, useContext } from 'react';
import { ChevronDown, Bold, Italic, Link, List, ListOrdered, Undo, Redo, ChevronLeft, ChevronRight } from 'lucide-react';
import { MedContext } from "../context/MedContext";

const Notes = () => {
    const { isNotesExpanded, setIsNotesExpanded, selectedUser } = useContext(MedContext);
    const [noteTitle, setNoteTitle] = useState(!selectedUser?'':selectedUser.name);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState("Normal");
    const editorRef = useRef(null);

    // Initialize the editor when component mounts
    useEffect(() => {
        if (editorRef.current && isNotesExpanded) {
            editorRef.current.contentEditable = true;
            editorRef.current.focus();
            // Set placeholder if empty
            if (!editorRef.current.textContent.trim()) {
                editorRef.current.innerHTML = '<p class="text-gray-400">Write your notes here...</p>';
            }
        }
    }, [isNotesExpanded]);

    useEffect(() => {
        if (selectedUser) {
            setNoteTitle(selectedUser.name);
        }
    }, [selectedUser]);

    // Handle formatting commands
    const execCommand = (command, value = null) => {
        // Clear placeholder if it exists
        if (editorRef.current?.classList?.contains('text-gray-400')) {
            editorRef.current.innerHTML = '';
            editorRef.current.classList.remove('text-gray-400');
        }

        document.execCommand(command, false, value);
        if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    // Format handlers
    const handleBold = () => execCommand('bold');
    const handleItalic = () => execCommand('italic');
    const handleLink = () => {
        const url = prompt('Enter URL:');
        if (url) execCommand('createLink', url);
    };
    const handleUnorderedList = () => execCommand('insertUnorderedList');
    const handleOrderedList = () => execCommand('insertOrderedList');
    const handleUndo = () => execCommand('undo');
    const handleRedo = () => execCommand('redo');

    const handleFormat = (e) => {
        setSelectedFormat(e.target.value);

        // Clear any existing formatting first
        execCommand('removeFormat');

        switch (e.target.value) {
            case 'Heading 1':
                execCommand('formatBlock', '<h1>');
                break;
            case 'Heading 2':
                execCommand('formatBlock', '<h2>');
                break;
            case 'Heading 3':
                execCommand('formatBlock', '<h3>');
                break;
            default:
                execCommand('formatBlock', '<p>');
        }
    };

    // Toggle notes expansion
    const toggleNotesExpansion = () => {
        setIsNotesExpanded(!isNotesExpanded);
    };

    // Handle editor click to clear placeholder
    const handleEditorClick = () => {
        if (editorRef.current?.textContent?.trim() === 'Write your notes here...') {
            editorRef.current.innerHTML = '';
        }
    };

    // Render collapsed version
    if (!isNotesExpanded) {
        return (
            <div className="h-full bg-white rounded-lg flex flex-col items-center justify-between py-4">
                <button
                    onClick={toggleNotesExpansion}
                    className="text-gray-500 p-2 rounded-full hover:text-gray-900"
                >
                    <img src="/notes.svg" className='w-5 h-5' alt="" />
                </button>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            {/* Header */}
            <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                <h1 className="text-lg sm:text-xl font-semibold mt-2 ">Notes</h1>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button
                            className="flex items-center gap-1 border border-gray-300 rounded-md px-3 py-1 text-sm"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            SOAP <ChevronDown size={16} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md z-10 w-24">
                                <div className="py-1">
                                    <button className="block w-full text-left px-4 py-1 text-sm hover:bg-gray-100">SOAP</button>
                                    <button className="block w-full text-left px-4 py-1 text-sm hover:bg-gray-100">Progress</button>
                                    <button className="block w-full text-left px-4 py-1 text-sm hover:bg-gray-100">Basic</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        className="text-gray-500 p-1 hover:bg-gray-100 rounded"
                        onClick={toggleNotesExpansion}
                    >
                        <img src="/notes.svg" className='w-5 h-5' alt="" />
                    </button>
                </div>
            </div>

            {/* Note Title */}
            <div className="border-b border-gray-200 p-4">
                <input
                    type="text"
                    className="w-full outline-none text-gray-800"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                />
            </div>

            {/* Checkboxes */}
            <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="update" className="w-4 h-4 text-blue-500" defaultChecked />
                    <label htmlFor="update" className="text-sm">
                        Update from transcript and review <span className="text-gray-500">(beta)</span>
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="generate" className="w-4 h-4 text-blue-500" defaultChecked />
                    <label htmlFor="generate" className="text-sm">
                        Generate Codes and review <span className="text-gray-500">(beta)</span>
                    </label>
                </div>
            </div>

            {/* Formatting Toolbar */}
            <div className="w-full p-4 border-t border-b border-gray-200">
                <div className="flex items-center gap-2 flex-wrap">
                    <button className="text-gray-500 p-1" onClick={handleUndo}>
                        <Undo size={18} />
                    </button>
                    <button className="text-gray-500 p-1" onClick={handleRedo}>
                        <Redo size={18} />
                    </button>
                    <div className="relative">
                        <select
                            className="appearance-none bg-white border border-gray-200 rounded px-3 py-1 text-sm"
                            value={selectedFormat}
                            onChange={handleFormat}
                        >
                            <option>Normal</option>
                            <option>Heading 1</option>
                            <option>Heading 2</option>
                            <option>Heading 3</option>
                        </select>
                    </div>
                    <button className="text-gray-500 p-1" onClick={handleBold}>
                        <Bold size={18} />
                    </button>
                    <button className="text-gray-500 p-1" onClick={handleItalic}>
                        <Italic size={18} />
                    </button>
                    <button className="text-gray-500 p-1" onClick={handleLink}>
                        <Link size={18} />
                    </button>
                    <button className="text-gray-500 p-1" onClick={handleUnorderedList}>
                        <List size={18} />
                    </button>
                    <button className="text-gray-500 p-1" onClick={handleOrderedList}>
                        <ListOrdered size={18} />
                    </button>
                </div>
            </div>

            {/* Rich Text Editor Area */}
            <div
                ref={editorRef}
                className="flex-1 p-4 outline-none overflow-y-auto"
                onClick={handleEditorClick}
                onInput={handleEditorClick}
            >
                {/* Placeholder content will be added by useEffect */}
            </div>

            {/* Update Button */}
            <div className="p-4 flex justify-end border-t border-gray-200">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">
                    Update EMR
                </button>
            </div>
        </div>
    );
};

export default Notes;