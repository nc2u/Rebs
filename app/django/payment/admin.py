from django.contrib import admin
from import_export.admin import ImportExportMixin

from .models import (SalesPriceByGT, InstallmentPaymentOrder, DownPayment, OverDueRule,
                     SpecialPaymentOrder, SpecialDownPay, SpecialOverDueRule)


@admin.register(SalesPriceByGT)
class SalesPriceByGTAdmin(ImportExportMixin, admin.ModelAdmin):
    list_display = ('id', 'project', 'order_group', 'unit_type', 'unit_floor_type',
                    'price_build', 'price_land', 'price_tax', 'price')
    list_display_links = ('project', 'unit_type', 'unit_floor_type')
    list_editable = ('price_build', 'price_land', 'price_tax', 'price')
    list_filter = ('project', 'order_group', 'unit_type')


@admin.register(InstallmentPaymentOrder)
class InstallmentPaymentOrderAdmin(ImportExportMixin, admin.ModelAdmin):
    list_display = ('id', 'project', 'pay_name', 'pay_sort', 'pay_code', 'pay_time',
                    'pay_ratio', 'alias_name', 'is_pm_cost', 'days_since_prev',
                    'pay_due_date', 'extra_due_date')
    search_fields = ('pay_name', 'alias_name',)
    list_editable = ('alias_name', 'is_pm_cost', 'days_since_prev', 'pay_due_date', 'extra_due_date')
    list_display_links = ('project', 'pay_name',)
    list_filter = ('project', 'pay_sort')


@admin.register(DownPayment)
class DownPaymentAdmin(ImportExportMixin, admin.ModelAdmin):
    list_display = ('id', 'project', 'order_group', 'unit_type', 'payment_amount')
    list_display_links = ('project', 'order_group', 'unit_type')
    list_editable = ('payment_amount',)
    list_filter = ('project', 'order_group', 'unit_type')


@admin.register(OverDueRule)
class OverDueRuleAdmin(ImportExportMixin, admin.ModelAdmin):
    list_display = ('id', 'project', '__str__', 'term_start', 'term_end', 'rate_year')
    list_display_links = ('__str__',)
    list_editable = ('term_start', 'term_end', 'rate_year')
    list_filter = ('project',)


@admin.register(SpecialPaymentOrder)
class SpecialPaymentOrderAdmin(ImportExportMixin, admin.ModelAdmin):
    list_display = ('id', 'project', 'pay_name', 'pay_sort', 'pay_code', 'pay_time',
                    'alias_name', 'days_since_prev', 'pay_due_date', 'extra_due_date')
    search_fields = ('pay_name', 'alias_name',)
    list_editable = ('alias_name', 'days_since_prev', 'pay_due_date', 'extra_due_date')
    list_display_links = ('project', 'pay_name',)
    list_filter = ('project', 'pay_sort')


@admin.register(SpecialDownPay)
class SpecialDownPayAdmin(ImportExportMixin, admin.ModelAdmin):
    list_display = ('id', 'project', 'order_group', 'unit_type', 'payment_amount')
    list_display_links = ('project', 'order_group', 'unit_type')
    list_editable = ('payment_amount',)
    list_filter = ('project', 'order_group', 'unit_type')


@admin.register(SpecialOverDueRule)
class SpecialOverDueRuleAdmin(ImportExportMixin, admin.ModelAdmin):
    list_display = ('id', 'project', '__str__', 'term_start', 'term_end', 'rate_year')
    list_display_links = ('__str__',)
    list_editable = ('term_start', 'term_end', 'rate_year')
    list_filter = ('project',)
