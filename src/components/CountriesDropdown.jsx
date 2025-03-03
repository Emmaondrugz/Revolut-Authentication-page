import { useEffect, useState, useRef } from "react";
import countriesData from '../app/lib/countries'

export default function CountriesDropdown({ dropdown, setDropdown, setSelectedCountry }) {
    // Handle the visibility of the dropdown with a smooth transition
    const [isVisible, setIsVisible] = useState(false);

    // Ref for the dropdown container to detect clicks outside
    const dropdownRef = useRef(null);

    // Sync the visibility state with the dropdown prop
    useEffect(() => {
        if (dropdown) {
            setIsVisible(true); // Show the dropdown
        } else {
            // Delay hiding the dropdown to allow the transition to complete
            const timeout = setTimeout(() => {
                setIsVisible(false);
            }, 300); // Match this duration with your CSS transition duration
            return () => clearTimeout(timeout); // Cleanup timeout
        }
    }, [dropdown]);






    useEffect(() => {
        const handleClickOutside = (event) => {
            // Only handle click outside if window width is above md breakpoint (768px by default)
            if (window.innerWidth >= 768 &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                setDropdown(false);
                console.log('close');
            }
        };

        // Add event listener when the dropdown is visible
        if (dropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        // Cleanup event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdown, setDropdown]);





    // Handle the input state
    const [input, setInput] = useState("");


    // Handle the dropdown countries
    const [countries, setCountries] = useState([])

    // Function to mix and filter country arrays
    function mixCountries(formattedCountries, newCountryData) {
        const combinedCountries = [...newCountryData, ...formattedCountries];

        const uniqueCountries = combinedCountries.filter((country, index, self) =>
            index === self.findIndex((c) => c.name === country.name)
        );

        // return the mixture of both countries data
        return uniqueCountries;
    }

    // Fetch country data from the API
    useEffect(() => {
        fetch('https://restcountries.com/v3.1/all')
            .then((response) => response.json())
            .then((data) => {
                // Format the countries data
                const formattedCountries = data.map((country) => ({
                    name: country.name.common,
                    flag: country.flags.png,
                    code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : 'NA'),
                }));

                // Mix the formatted countries with static data
                const mixedCountries = mixCountries(formattedCountries, countriesData);

                // Sort the mixed countries alphabetically by name
                const sortedCountries = mixedCountries.sort((a, b) => {
                    if (a.name < b.name) return -1; // a comes before b
                    if (a.name > b.name) return 1; // a comes after b
                    return 0; // names are equal
                });

                // Set the sorted countries to state
                setCountries(sortedCountries);
            })
            .catch((error) => console.error('Error fetching countries:', error));
    }, []);



    return (
        <>
            <div
                ref={dropdownRef}
                className={`absolute h-[352px] mt-[60px] overflow-auto transition-all duration-300 ${isVisible ? "opacity-100 visible translate-y-[4px]" : "opacity-0 invisible -translate-y-[4px]"} z-50 rounded-2xl w-[352px] bg-white shadow-sm md:block hidden`}
            >
                {/* Dropdown header */}
                <div className="w-full border-[#f7f7f7] border-b-[0.5px] p-[1rem] flex gap-[1rem] min-w-[0px]">
                    <input
                        type="text"
                        placeholder="Search"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 placeholder:text-[opacity-20] focus:outline-none caret-black" />
                    <div>
                        <img
                            src={`${input.length === 0 ? 'https://assets.revolut.com/assets/icons/Search.svg' : 'https://assets.revolut.com/assets/icons/CrossCircle.svg'}`}
                            className="opacity-20 cursor-pointer"
                            alt=""
                            onClick={() => setInput("")} // Clear input when the icon is clicked
                        />
                    </div>
                </div>

                {/* Countries */}
                <div className="relative p-1 block text-[#191c1f] h-[12144px]">
                    {countries?.map((country) => (
                        <button
                            key={country.name} // Add a unique key for each item
                            className="rounded-[1rem] mb-2 w-full items-center justify-start gap-x-[0.5rem] h-[57px] py-[12px] transition-all duration-200 px-[12px] hover:bg-[#f7f7f7] flex"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent event bubbling
                                e.preventDefault(); // Prevent default form submission (if inside a form)
                                setSelectedCountry(country); // Update the selected country
                                setDropdown(false);
                                console.log(country);
                            }}
                        >
                            <div className="bg-yellow-200 w-10 h-10 rounded-full">
                                <img src={country.flag} alt={country.name} className="w-full h-full rounded-full" />
                            </div>
                            <div className="min-w-[48px] text-[#717173]">
                                {country.code}
                            </div>
                            <div className="max-w-full ml-2 min-w-0 overflow-hidden whitespace-nowrap">
                                {country.name}
                            </div>
                        </button>
                    ))}
                </div>
            </div>







            {/* Mobile Version */}
            <div className={`overlay z-50 fixed ${dropdown ? 'block md:hidden' : 'hidden'} flex justify-center items-end sm:items-start top-0 left-0 bg-black bg-opacity-30 w-full h-screen`}>
                <div className={`mt-[60px] gap-y-[1rem] justify-between bg-[#f7f7f7] sm:max-h-[640px] sm:mb-10 rounded-[1.5rem] p-[1.5rem] z-50 relative overflow-auto transition-all duration-300 ${isVisible ? "opacity-100 visible translate-y-[4px]" : "opacity-0 invisible -translate-y-[4px]"} z-50 sm:rounded-2xl rounded-t-2xl rounded-b-none sm:rounded-b-2xl sm:max-w-[390px] w-full h-full shadow-sm block`}>
                    {/* Dropdown header */}
                    <div className="w-full border-[#f7f7f7] bg-[#f7f7f7] flex items-center gap-2">

                        <div className="flex-grow bg-[#ebebf2] gap-x-[10px] rounded-full flex items-center h-[36px] w-[490px] py-[0.375rem] pl-[0.375rem] pr-[0.5rem]">
                            <img
                                src={`${input.length === 0 ? 'https://assets.revolut.com/assets/icons/Search.svg' : 'https://assets.revolut.com/assets/icons/CrossCircle.svg'}`}
                                className="opacity-50 cursor-pointer"
                                alt=""
                                onClick={() => setInput("")} // Clear input when the icon is clicked
                            />
                            <input
                                type="text"
                                placeholder="Search"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 placeholder:text-[opacity-40] placeholder:text-[14px] bg-[#ebebf2] focus:outline-none caret-black" />
                        </div>

                        <div className="text-[#4f55f1] w-[max-contetnt] items-center font-normal text-[0.875rem] tracking-[-0.00714em]">
                            Cancel
                        </div>
                    </div>

                    {/* Countries */}
                    <div className="relative p-1 mt-5 rounded-2xl block text-[#191c1f] h-[12144px] bg-white">
                        {countries?.map((country) => (
                            <button
                                key={country.name} // Add a unique key for each item
                                className="rounded-[1rem] mb-2 w-full items-center justify-start gap-x-[0.5rem] h-[57px] py-[12px] transition-all duration-200 px-[12px] hover:bg-[#f7f7f7] flex"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent event bubbling
                                    e.preventDefault(); // Prevent default form submission (if inside a form)
                                    setSelectedCountry(country); // Update the selected country
                                    setDropdown(false);
                                    console.log(country);
                                }}
                            >
                                <div className="bg-yellow-200 w-10 h-10 rounded-full">
                                    <img src={country.flag} alt={country.name} className="w-full h-full rounded-full" />
                                </div>
                                <div className="min-w-[48px] text-[#717173]">
                                    {country.code}
                                </div>
                                <div className="max-w-full ml-2 min-w-0 overflow-hidden whitespace-nowrap">
                                    {country.name}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}