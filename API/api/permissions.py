from rest_framework.permissions import BasePermission


class IsStudent(BasePermission):
    message = 'Only student allowed'
    def has_permission(self, request, view):
        if (not hasattr(request, 'user')):
            return False
        return (request.user.user_type == 'student' and hasattr(request.user, 'student'))

class IsValidatedStudent(BasePermission):
    message = "Only validated student allowed"
    def has_permission(self, request, view):
        if (not hasattr(request, 'user')):
            return False
        user = request.user
        student = getattr(user, 'student')
        return student.is_active

class IsCompany(BasePermission):
    message = 'Only company allowed'
    
    def has_permission(self, request, view):
        if (not hasattr(request, 'user')):
            return False
        user = request.user
        return (user.user_type == 'company' and hasattr(user, 'company'))

class IsValidatedCompany(BasePermission):
    message = "Only validated allowed"

    # def has_object_permission(self, request, view, obj):
    #     return super().has_object_permission(request, view, obj)

    def has_permission(self, request, view):
        if (not hasattr(request, 'user')):
            return False
        company = request.user.company
        return (company.is_active)
