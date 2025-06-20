from django.db.models import Lookup
from django.db.models.fields import Field

class UnaccentIcontains(Lookup):
    lookup_name = 'iunaccent'

    def as_sql(self, compiler, connection):
        lhs, lhs_params = self.process_lhs(compiler, connection)
        rhs, rhs_params = self.process_rhs(compiler, connection)
        params = lhs_params + rhs_params

        if connection.vendor == 'postgresql':
            return "UNACCENT(%s) ILIKE UNACCENT('%%%%' || %s || '%%%%')" % (lhs, rhs), params
        else:
            return "%s LIKE '%%%%' || %s || '%%%%'" % (lhs, rhs), params
    
Field.register_lookup(UnaccentIcontains)