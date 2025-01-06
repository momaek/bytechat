<template>
  <Dialog v-bind:open="isDialogOpen">
    <DialogContent
      @close="handleCancel"
      class="sm:max-w-[924px] max-h-[50dvh] flex flex-col"
    >
      <DialogHeader class="flex-none">
        <DialogTitle>Model List</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <div
        class="w-full flex-1 flex flex-col overflow-auto"
        v-if="models?.length > 0"
      >
        <div class="flex gap-2 items-center py-4 px-1 flex-none">
          <Input
            class="max-w-sm"
            placeholder="Filter name..."
            :model-value="table.getColumn('name')?.getFilterValue() as string"
            @update:model-value="
              table.getColumn('name')?.setFilterValue($event)
            "
          />
        </div>
        <div class="rounded-md border flex-1 overflow-auto">
          <Table v-if="models?.length > 0" :aria-rowcount="5">
            <TableHeader>
              <TableRow
                v-for="headerGroup in table.getHeaderGroups()"
                :key="headerGroup.id"
              >
                <TableHead
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                >
                  <FlexRender
                    v-if="!header.isPlaceholder"
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="table.getRowModel().rows?.length">
                <template v-for="row in table.getRowModel().rows" :key="row.id">
                  <TableRow :data-state="row.getIsSelected() && 'selected'">
                    <TableCell
                      v-for="cell in row.getVisibleCells()"
                      :key="cell.id"
                    >
                      <FlexRender
                        :render="cell.column.columnDef.cell"
                        :props="cell.getContext()"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow v-if="row.getIsExpanded()">
                    <TableCell :colspan="row.getAllCells().length">
                      <div class="p-4 space-y-4">
                        <div class="grid gap-4 md:grid-cols-2">
                          <div class="space-y-2">
                            <label class="text-sm font-medium">API Base</label>
                            <Input
                              v-model="row.original.api_base"
                              placeholder="Enter API base URL"
                            />
                          </div>
                          <div class="space-y-2">
                            <label class="text-sm font-medium">API Key</label>
                            <Input
                              v-model="row.original.api_key"
                              type="password"
                              placeholder="Enter API key"
                            />
                          </div>
                        </div>
                        <div class="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            @click="row.toggleExpanded()"
                          >
                            {{ $t("common.close") }}
                          </Button>
                          <Button
                            size="sm"
                            @click="handleUpdateModel(row.original, row)"
                          >
                            {{ $t("common.save") }}
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </template>
              </template>
              <TableRow v-else>
                <TableCell :colspan="columns.length" class="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div class="flex items-center justify-end space-x-2 py-4 flex-none">
          <div class="flex-1 text-sm text-muted-foreground">
            {{ table.getFilteredSelectedRowModel().rows.length }} of
            {{ table.getFilteredRowModel().rows.length }} row(s) selected.
          </div>
          <div class="space-x-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="!table.getCanPreviousPage()"
              @click="table.previousPage()"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              :disabled="!table.getCanNextPage()"
              @click="table.nextPage()"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      <DialogFooter class="flex-none">
        <Button @click="handleCancel">{{ $t("setting.cancel") }}</Button>
        <Button @click="handleSave">{{ $t("setting.save") }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, h } from "vue";
import Button from "@/components/ui/button/Button.vue";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { API, Model } from "@/types/chat";
import { useModelStore } from "@/stores/model";

import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  Row,
  SortingState,
} from "@tanstack/vue-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import { ArrowUpDown } from "lucide-vue-next";
import DropdownAction from "./components/DataTableDropDown.vue";
import { valueUpdater } from "@/utils/utils";

// Define props
const props = defineProps<{
  api: API;
  dialog_open: boolean;
}>();

// Define emits
const emit = defineEmits(["update:dialog-close"]);

// Local state for dialog open/close
const isDialogOpen = ref(props.dialog_open);

// Watch for changes in props.DialogOpen
watch(
  () => props.dialog_open,
  (newVal) => {
    isDialogOpen.value = newVal;
  }
);

// Handle cancel button click
const handleCancel = () => {
  isDialogOpen.value = false;
  emit("update:dialog-close");
};

const modelStore = useModelStore();
// Handle continue button click
const handleSave = async () => {
  try {
    modelStore.updateAPI(props.api);
    isDialogOpen.value = false; // Close the dialog after successful API call
    emit("update:dialog-close");
  } catch (error) {
    console.error("API call failed:", error);
  }
};

const columns: ColumnDef<Model>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(Checkbox, {
        checked:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate"),
        "onUpdate:checked": (value) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: "Select all",
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        "onUpdate:checked": (value) => row.toggleSelected(!!value),
        ariaLabel: "Select row",
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    cell: ({ row }) => h("div", row.getValue("name")),
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Email", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
  },
  {
    accessorKey: "api_base",
    header: "API Base",
    cell: ({ row }) =>
      h("div", { class: "lowercase" }, row.getValue("api_base")),
  },
  {
    accessorKey: "api_key",
    header: "API Token",
    cell: ({ row }) => {
      const apiKey = row.getValue("api_key") as string;
      // 只显示前4位和后4位，中间用*代替
      const maskedApiKey = apiKey
        ? `${apiKey.slice(0, 4)}****${apiKey.slice(-8)}`
        : "";
      return h("div", maskedApiKey);
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const model = row.original;

      return h(
        "div",
        { class: "relative" },
        h(DropdownAction, {
          model,
          onExpand: row.toggleExpanded,
          onDelete: handleDeleteModel,
        })
      );
    },
  },
];

const models = ref<Model[]>(props.api.models as Model[]);
watch(
  () => props.api.models,
  (newModels) => {
    models.value = newModels as Model[];
  }
);
const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});
const table = useVueTable({
  get data() {
    return models.value || [];
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnFilters),
  onRowSelectionChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
    get expanded() {
      return expanded.value;
    },
  },
});
const handleUpdateModel = async (model: Model, row: Row<Model>) => {
  try {
    // 更新模型数据
    const updatedModels = models.value.map((m) =>
      m.name === model.name ? model : m
    );
    models.value = updatedModels;

    // 更新 API 对象
    props.api.models = updatedModels;

    // 关闭展开行
    row.toggleExpanded(false);
  } catch (error) {
    console.error("Failed to update model:", error);
  }
};

const handleDeleteModel = async (model: Model) => {
  try {
    const updatedModels = models.value.filter((m) => m.name !== model.name);
    models.value = updatedModels;
    props.api.models = updatedModels;
  } catch (error) {
    console.error("Failed to delete model:", error);
  }
};
</script>
