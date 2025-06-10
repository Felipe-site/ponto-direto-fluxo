from django.contrib import admin
from .models import Categoria, Produto, DetalhesProduto, Cupom, CupomUsado
from django.utils.html import format_html
from taggit.models import Tag

class DetalhesProdutoInline(admin.StackedInline):
    model = DetalhesProduto
    extra = 1

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'slug')
    prepopulated_fields = {'slug': ('nome',)}
    search_fields = ('nome',)

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'categoria', 'tipo', 'concurso', 
                    'codigo', 'preco', 'tag', 'destaque', 
                    'exibir_imagem', 'data_atualizacao')
    list_filter = ('categoria', 'tipo', 'concurso', 
                   'tag', 'destaque', 'data_criacao')
    search_fields = ('titulo', 'codigo', 'descricao', 'concurso')
    prepopulated_fields = {'slug': ('titulo',)}
    inlines = [DetalhesProdutoInline]
    list_editable = ('destaque', 'tag')
    
    def exibir_imagem(self, obj):
        if obj.imagem:
            return format_html('<img src="{}" width="50" height="50" />', obj.imagem.url)
        return "Sem imagem"
    exibir_imagem.short_description = "Imagem"

    fieldsets = (
        ('Informações Básicas', {
            'fields': ('titulo', 'slug', 'categoria', 'concurso', 'tag', 'destaque', 'tags')
        }),
        ('Descrição', {
            'fields': ('descricao_curta', 'descricao')
        }),
        ('Preço', {
            'fields': ('preco', 'parcelas')
        }),
        ('Imagem', {
            'fields': ('imagem',)
        }),
        ('Amostra', {
            'fields': ('amostra',)
        }),
        ('Combos', {
            'fields': ('is_combo', 'produtos_inclusos')
        }),
    )

@admin.register(Cupom)
class CupomAdmin(admin.ModelAdmin):
    list_display = ('codigo', 'tipo', 'valor', 'ativo', 'validade')
    list_filter = ('ativo', 'tipo', 'validade')
    search_fields = ('codigo',)

@admin.register(CupomUsado)
class CupomUsadoAdmin(admin.ModelAdmin):
    list_display = ('cupom', 'usuario', 'usado_em')
    list_filter = ('cupom', 'usuario')
    search_fields = ('cupom__codigo', 'usuario__username')