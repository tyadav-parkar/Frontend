import React from 'react';
 
const AvatarGroup = ({ avatars, maxVisible = 3 }) => { // Corrected syntax for props
    return (
        <div className="flex items-center">
            {avatars.slice(0, maxVisible).map((avatar, index) => (
                <img
                    key={index}
                    src={avatar}
                    alt={`Avatar ${index}`} // Corrected template literal syntax
                    // Added necessary CSS classes for positioning and style
                    className="w-9 h-9 rounded-full border-2 border-white first:ml-0 -ml-3 object-cover shadow-sm"
                />
            ))}
            {avatars.length > maxVisible && (
                // Added CSS classes for styling the count badge
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white -ml-3 shadow-sm">
                    +{avatars.length - maxVisible}
                </div>
            )}
        </div>
    );
};
 
export default AvatarGroup;
 
 