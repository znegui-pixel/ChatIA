export const requireAdmin = (req, res, next) => {
    if (res.locals.jwtData?.role !== "admin") {
        return res.status(403).json({ message: "Accès interdit (admin uniquement)" });
    }
    next();
};
