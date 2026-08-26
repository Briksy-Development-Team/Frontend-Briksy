import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  fetchEmailTemplatesApi,
  createEmailTemplateApi,
  updateEmailTemplateApi,
  deleteEmailTemplateApi,
} from "./email-template.api";
import type {
  EmailTemplate,
  EmailTemplateFormValues,
} from "./email-template.types";

type EmailTemplateState = {
  data: EmailTemplate[];
  loading: boolean;
  error: string | null;
  isModalOpen: boolean;
  editingTemplate: EmailTemplate | null;
  saving: boolean;
};

const initialState: EmailTemplateState = {
  data: [],
  loading: false,
  error: null,
  isModalOpen: false,
  editingTemplate: null,
  saving: false,
};

export const fetchEmailTemplates = createAsyncThunk(
  "emailTemplates/fetch",
  async () => {
    return await fetchEmailTemplatesApi("super-admin");
  },
);

export const saveEmailTemplate = createAsyncThunk(
  "emailTemplates/save",
  async (payload: { id?: string; values: EmailTemplateFormValues }) => {
    if (payload.id) {
      return await updateEmailTemplateApi("super-admin", payload.id, payload.values);
    }
    return await createEmailTemplateApi("super-admin", payload.values);
  },
);

export const removeEmailTemplate = createAsyncThunk(
  "emailTemplates/delete",
  async (id: string) => {
    await deleteEmailTemplateApi("super-admin", id);
    return id;
  },
);

const emailTemplateSlice = createSlice({
  name: "emailTemplates",
  initialState,
  reducers: {
    openTemplateModal(state, action: PayloadAction<EmailTemplate | null>) {
      state.isModalOpen = true;
      state.editingTemplate = action.payload;
    },
    closeTemplateModal(state) {
      state.isModalOpen = false;
      state.editingTemplate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmailTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmailTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEmailTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load templates";
      })

      .addCase(saveEmailTemplate.pending, (state) => {
        state.saving = true;
      })
      .addCase(saveEmailTemplate.fulfilled, (state, action) => {
        state.saving = false;
        state.isModalOpen = false;
        state.editingTemplate = null;
        const idx = state.data.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.data[idx] = action.payload;
        else state.data.push(action.payload);
      })
      .addCase(saveEmailTemplate.rejected, (state) => {
        state.saving = false;
      })

      .addCase(removeEmailTemplate.fulfilled, (state, action) => {
        state.data = state.data.filter((t) => t.id !== action.payload);
      });
  },
});

export const { openTemplateModal, closeTemplateModal } =
  emailTemplateSlice.actions;
export default emailTemplateSlice.reducer;
