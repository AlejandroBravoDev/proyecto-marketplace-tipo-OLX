const verifyToken = require("../middleware/auth");

router.get("/verify", verifyToken, (req, res) => {
  res.json({
    isAuthenticated: true,
    usuario: req.user,
  });
});
