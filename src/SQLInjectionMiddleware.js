// sqlInjectionCheck.js

function sqlInjectionCheck(req, res, next) {
    const { body } = req;
    const sqlRegex = /(\b(?:drop|truncate)\b\s*table|\b(?:exec|execute)\s*\(.*?\)|\b(?:delete|update)\b\s+\w+\s+set|@\@version|\bselect\b.*?\bfrom\b|\bselect\b.*?\bwhere\b|\binsert\b\s+into\b|\bunion\b\s+(?:all\s+)?\bselect\b)/i;

    for (const key in body) {
        if (typeof body[key] === 'string' && sqlRegex.test(body[key])) {
            return res.status(400).json({ error: 'Potential SQL injection detected!' });
        }
    }
    next();
}

module.exports = sqlInjectionCheck;
