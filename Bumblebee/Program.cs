using Microsoft.AspNetCore.NodeServices;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Text;
using System.Threading.Tasks;

namespace Bumblebee
{
    class Program
    {
        static async Task Main()
        {
            var sb = new StringBuilder();
            sb.Append("Enter:\n");
            sb.Append("\"1\" to transform source json\n");
            sb.Append("\"2\" to process destination json\n");
            sb.Append("\"3\" to add new parameter in all processes\n");
            sb.Append("\"4\" to full search\n");
            sb.Append("\"5\" to get referrer processes\n");


            Console.WriteLine(sb.ToString());
            Variables.Step = Console.ReadLine();

            if (Variables.Step == "1")
            {
                Console.WriteLine("Enter source json path");
                Variables.SourceJsonPath = Console.ReadLine();
                Console.WriteLine("Enter source state diagram id");
                Variables.SourceStateDiagramId = Console.ReadLine();
                Console.WriteLine("Enter destination state diagram id");
                Variables.DestinationStateDiagramId = Console.ReadLine();
            }

            var services = new ServiceCollection();
            services.AddTransient<Bumblebee>();
            services.AddNodeServices();

            var serviceProvider = services.BuildServiceProvider();
            await serviceProvider.GetService<Bumblebee>().Run(serviceProvider.GetService<INodeServices>());
        }
    }
}