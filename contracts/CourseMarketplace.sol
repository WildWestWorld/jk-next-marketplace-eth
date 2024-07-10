// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CourseMarketplace {
    enum State {
        Purchased,
        Activated,
        Deactivated
    }

    struct Course {
        uint id;
        uint price;
        bytes32 proof;
        address owner;
        State state;
    }

    mapping(bytes32 => Course) private ownedCourses;
    mapping(uint => bytes32) private ownedCourseHash;
    uint private totalOwnedCourses;
    address payable private owner;

    event Debug(string message);

    constructor() {
        setContractOwner(msg.sender);
    }

    /// Course has invalid state!
    error InvalidState();

    /// Course is not created!
    error CourseIsNotCreated();

    /// Course has already a Owner!
    error CourseHasOwner();

    /// Only owner has an access!
    error OnlyOwner();

    modifier onlyOwner() {
        if (msg.sender != getContractOwner()) {
            revert OnlyOwner();
        }
        _;
    }

    function purchaseCourse(bytes16 courseId, bytes32 proof) external payable {
        bytes32 courseHash = keccak256(abi.encodePacked(courseId, msg.sender));

        if (hasCourseOwnership(courseHash)) {
            revert CourseHasOwner();
        }

        uint id = totalOwnedCourses++;

        ownedCourseHash[id] = courseHash;
        ownedCourses[courseHash] = Course({
            id: id,
            price: msg.value,
            proof: proof,
            owner: msg.sender,
            state: State.Purchased
        });
    }

    function activateCourse(bytes32 courseHash) external onlyOwner {
        if (!isCourseCreated(courseHash)) {
            emit Debug("Course is not created");
            revert CourseIsNotCreated();
        }

        Course storage course = ownedCourses[courseHash];

        if (course.state != State.Purchased) {
            emit Debug("Invalid course state");
            revert InvalidState();
        }

        course.state = State.Activated;
        emit Debug("Course activated successfully");
    }

    function transferOwnership(address newOwner) external onlyOwner {
        setContractOwner(newOwner);
    }

    function getCourseCount() external view returns (uint) {
        return totalOwnedCourses;
    }

    function getCourseHashAtIndex(uint index) external view returns (bytes32) {
        return ownedCourseHash[index];
    }

    function getCourseByHash(
        bytes32 courseHash
    ) external view returns (Course memory) {
        return ownedCourses[courseHash];
    }

    function getContractOwner() public view returns (address) {
        return owner;
    }

    function setContractOwner(address newOwner) private {
        owner = payable(newOwner);
    }

    function isCourseCreated(bytes32 courseHash) private view returns (bool) {
        return ownedCourses[courseHash].owner != address(0);
    }

    function hasCourseOwnership(
        bytes32 courseHash
    ) private view returns (bool) {
        return ownedCourses[courseHash].owner == msg.sender;
    }
}
