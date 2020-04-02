using System;
using System.Net.Http;
using System.Threading.Tasks;
using toc_autocapture.Models;
using Newtonsoft.Json;
using System.Text;

namespace toc_autocapture.Helper
{
    public class TocHelper
    {
        public async Task<TocResponse> GetSessionID(string apiKey, string url, bool autoCapture)
        {
            object data = autoCapture ? (new { apiKey = apiKey, autocapture = true }) :
                (object)(new { apiKey = apiKey });
            //var data = new { apiKey = apiKey, autocapture = true };
            using (var client = new HttpClient())
            {
                using (var request = new HttpRequestMessage(HttpMethod.Post, url))
                {
                    using (var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json"))
                    {
                        request.Content = content;
                        using (var response = await client.SendAsync(request, HttpCompletionOption.ResponseContentRead))
                        {
                            var responseData = await response.Content.ReadAsStringAsync();
                            var jsonRespone = JsonConvert.DeserializeObject<TocResponse>(responseData);
                            return jsonRespone;
                        }
                    }
                }
            }
        }

        public async Task<string> ValidateFaceAndDocuemnt(string apiKey, string url, DocumentValidationModel validationModel)
        {
            using (var client = new HttpClient())
            {
                using (var request = new HttpRequestMessage(HttpMethod.Post, url))
                {
                    using (var content = new MultipartFormDataContent())
                    {
                        content.Add(new StringContent(apiKey), "apiKey");
                        content.Add(new StringContent(validationModel.DocumentFront), "id_front");
                        content.Add(new StringContent(validationModel.DocumentBack), "id_back");
                        content.Add(new StringContent(validationModel.Selfie), "selfie");
                        content.Add(new StringContent(validationModel.DocumentType), "documentType");
                        
                        request.Content = content;
                        using (var response = await client.SendAsync(request, HttpCompletionOption.ResponseContentRead))
                        {
                            var responseData = await response.Content.ReadAsStringAsync();
                            return responseData;
                        }
                    }
                }
            }

        }
    }
}
