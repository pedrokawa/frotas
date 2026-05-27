export const uploadCloudinary = async (uri: string, presetName: string) => {
  if (!uri) {
    throw new Error("A URI da foto está vazia.");
  }

  const data = new FormData();

  data.append("file", {
    uri: uri,
    type: "image/jpeg",
    name: `foto_${Date.now()}.jpg`,
  } as any);

  data.append("upload_preset", presetName);
  data.append("cloud_name", "dkrosnkyu");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dkrosnkyu/auto/upload",
      {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const json = await response.json();

    if (json.error) {
      //   console.log("❌ REJEIÇÃO DO CLOUDINARY:", json.error.message);
      throw new Error(json.error.message);
    }

    if (json.secure_url) {
      //   console.log("✅ UPLOAD COM SUCESSO! Link:", json.secure_url);
      return json.secure_url;
    } else {
      //   console.log("Erro estranho:", json);
      throw new Error("Erro ao gerar link no Cloudinary.");
    }
  } catch (error) {
    console.error(`Erro no upload: ${presetName}`, error);
    throw error;
  }
};
