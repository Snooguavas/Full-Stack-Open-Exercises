const Search = ({handleSearchChange}) => {
    return (
    <input type="text" placeholder="Search contacts" onChange={handleSearchChange}/>
    )
}

export default Search