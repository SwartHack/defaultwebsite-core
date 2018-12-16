﻿// <auto-generated />
using System;
using DefaultWeb.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace DefaultWeb.Migrations
{
    [DbContext(typeof(DwsDbContext))]
    [Migration("20181108072341_InitialCreate")]
    partial class InitialCreate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.4-rtm-31024")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("DefaultWeb.Models.DefaultWebSite.DwsFile.DwsFileInfo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("CreatedTimestamp");

                    b.Property<string>("Description");

                    b.Property<string>("FileFull");

                    b.Property<string>("FileName");

                    b.Property<string>("FilePath");

                    b.Property<long>("FileSize");

                    b.Property<string>("FriendlyName");

                    b.Property<string>("MimeType");

                    b.Property<string>("SessionId");

                    b.Property<DateTime>("UpdatedTimestamp");

                    b.HasKey("Id");

                    b.ToTable("DwsFileInfo");
                });

            modelBuilder.Entity("DefaultWeb.Models.DefaultWebSite.Entities.Comment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Author")
                        .IsRequired()
                        .HasMaxLength(16);

                    b.Property<string>("Content")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<DateTime>("Datetime");

                    b.Property<string>("SessionId");

                    b.Property<int>("SourceId");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(32);

                    b.HasKey("Id");

                    b.HasIndex("SourceId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("DefaultWeb.Models.DefaultWebSite.Entities.Source", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(32);

                    b.Property<string>("SessionId");

                    b.Property<string>("SourceName")
                        .IsRequired()
                        .HasMaxLength(16);

                    b.HasKey("Id");

                    b.ToTable("Sources");
                });

            modelBuilder.Entity("DefaultWeb.Models.DefaultWebSite.Entities.Comment", b =>
                {
                    b.HasOne("DefaultWeb.Models.DefaultWebSite.Entities.Source", "Source")
                        .WithMany("Comments")
                        .HasForeignKey("SourceId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
