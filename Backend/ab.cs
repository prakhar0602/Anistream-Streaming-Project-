using NUnit.Framework;
using Microsoft.AspNetCore.Mvc;
using Moq;
using EShoppingZone.Controllers;
using ModelLayer.DTO;
using BuisnessLayer.Interface;
using System.Collections;
namespace EShoppingZone.Tests 
{ 
    [TestFixture] 
    public class UserControllerTests { 
        private Mock<IUserBL> _mockUserBL; private Mock<IEmailService> _mockEmailService; private UserController _controller; [SetUp] public void SetUp() { _mockUserBL = new Mock<IUserBL>(); _mockEmailService = new Mock<IEmailService>(); _controller = new UserController(_mockUserBL.Object, _mockEmailService.Object); } [Test] public void Login_ReturnsOkResult() { var dto = new UserDTO { Email = "galvatron0602@gmail.com", Password = "Abc@12345", Role = "Merchant" }; var list = new ArrayList { "djh sefiu gheiufg hrui shg", "ufdhgsuighurigor" }; ResponseDTO response = new ResponseDTO(200, "Login Successfull", list); // Assuming ResponseDTO has Message and Status properties _mockUserBL.Setup(bl => bl.userLogin(dto)).Returns(response); var result = _controller.Login(dto); Assert.IsInstanceOf<ObjectResult>(result); var okResult = result as ObjectResult; Assert.AreEqual(response, okResult.Value); } } }