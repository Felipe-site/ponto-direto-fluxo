class AllowPDFIframeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if request.path.startswith('/media/amostras/') and request.path.endswith('.pdf'):
            response['Content-Disposition'] = 'inline'
            response['X-Frame-Options'] = 'ALLOWALL'

        return response
