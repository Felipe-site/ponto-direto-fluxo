from django.contrib import admin
from .models import Pedido, ItemPedido

class ItemPedidoInline(admin.TabularInline):
    model = Pedido.itens.through
    extra = 0

class PedidoAdmin(admin.ModelAdmin):
    list_display = ['id', 'usuario', 'total', 
                    'status', 'criado_em']
    
    list_filter = ['status', 'criado_em']
    search_fields = ['usuario__username', 'cupom__codigo']
    inlines = [ItemPedidoInline]
    readonly_fields = ['subtotal', 'desconto', 'total', 'criado_em']

admin.site.register(Pedido, PedidoAdmin)