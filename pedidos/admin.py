from django.contrib import admin
from .models import Pedido, ItemPedido

class ItemPedidoInline(admin.TabularInline):
    model = Pedido.itens.through
    extra = 0
    readonly_fields = ('itempedido',)
    can_delete = False

    def has_change_permission(self, request, obj=None):
        return False
    
    def has_add_permission(self, request, obj=None):
        return False

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    inlines = [ItemPedidoInline]

    list_display = ['id', 'usuario', 'codigo', 'total', 
                    'status', 'criado_em']
    
    list_display_links = ['id', 'codigo']
    
    list_filter = ['status', 'criado_em']
    search_fields = ['usuario__username', 'codigo', 'cupom__codigo']
    readonly_fields = ['id', 'usuario', 'codigo', 'subtotal', 'desconto', 'total', 'criado_em']

    fieldsets = (
        ('Informações do Pedido', {
            'fields': ('id', 'usuario', 'status', 'criado_em')
        }),
        ('Detalhes do Pagamento', {
            'fields': ('codigo', 'subtotal', 'desconto', 'cupom', 'total')
        }),
    )

admin.site.register(ItemPedido)