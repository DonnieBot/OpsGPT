import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def calculate_variance(actual: float, target: float) -> float:
    if target == 0:
        return 0.0
    return round(((actual - target) / target) * 100, 2)

def classify_root_cause(comment: str) -> tuple:
    comment_lower = comment.lower()
    
    if 'new hire' in comment_lower or 'training' in comment_lower:
        return ('People', 'New Hire / Training')
    elif 'system' in comment_lower or 'technology' in comment_lower or 'tool' in comment_lower:
        return ('Technology', 'System Issue')
    elif 'process' in comment_lower or 'procedure' in comment_lower:
        return ('Process', 'Procedure Gap')
    elif 'staffing' in comment_lower or 'headcount' in comment_lower:
        return ('People', 'Staffing')
    elif 'client' in comment_lower or 'customer' in comment_lower:
        return ('External', 'Client Related')
    elif 'volume' in comment_lower or 'traffic' in comment_lower:
        return ('Process', 'Volume Variance')
    else:
        return ('Unclassified', 'To Be Determined')