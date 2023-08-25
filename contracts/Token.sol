// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Token {
    // ERC-20
    string public name;
    string public symbol;
    uint256 public decimals = 18;
    uint256 public totalSupply;

    // Track Balances
    mapping(address => uint256) public balanceOf;
    // Check Allowance
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    constructor(string memory _name, string memory _symbol, uint256 _totalSupply){
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10 ** decimals); // 1_000_000 * 10^18
        balanceOf[msg.sender] = totalSupply; // assign all tokens to the deployer
    }

    // Send Tokens
    function transfer(address _to, uint256 _value) public returns (bool success){
        // Require that sender has enough Tokens to spend
        require(_value <= balanceOf[msg.sender], "Insufficient Balance");
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function _transfer(address _from, address _to, uint256 _value) internal {

        require(_to != address(0));
        // Deduct tokens from sender
        balanceOf[_from] = balanceOf[_from] - _value;
        // Credit tokens to receiver
        balanceOf[_to] = balanceOf[_to] + _value;
        // Emit Transfer event
        emit Transfer(_from, _to, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        // Check Approval
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        // Reset Allowance
        allowance[_from][msg.sender] = allowance[_from][msg.sender] - _value;
        // Send Token
        _transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success){
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
}
