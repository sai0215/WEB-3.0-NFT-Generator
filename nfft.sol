// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Nftfolk is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    mapping(string => uint8) existingURIs; 

    constructor() ERC721("Nftfolk", "FTK") {} //**DOUBT**//

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function isContentOwned(string memory uri) public view returns (bool){
        return existingURIs[uri]==1;
    }
    function payToMint(address recipient, string memory metadataURI)
    public payable returns(uint256) { //payable is a function which recieves ether
        require(existingURIs[metadataURI]!=1,'Minted Already fool'); //incase we duplicate the mint
        require(msg.value>=0.05 ether, 'Raise it uo biatch');// msg is a global variable which contains the amount of ether being sent into the contract 
        uint256 newItemId=_tokenIdCounter.current();
        _tokenIdCounter.increment(); //the counter implemented by openzepplin will increment each new token with one. It starts at zero and goes to one and so on.
        existingURIs[metadataURI]=1; //Update our mapping of the existing uris
        _mint(recipient, newItemId); //calling the built in mint function with the recepient's wallet address
        _setTokenURI(newItemId,metadataURI); //finally we set the token uri on that id

        return newItemId;

    }
   // A function to tell how many tokens we have printed so far
    function count() public view returns (uint256){
        return _tokenIdCounter.current();
    }

}
